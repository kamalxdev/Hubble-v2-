import {
  callAnswered,
  callRejected,
  iCallSlice,
  setCall,
} from "@/redux/features/call";
import {
  iFriendSlice,
  updateChats,
  updateFriends,
} from "@/redux/features/friends";
// import { initializeWebRTCpeers, startStreaming } from "@/redux/features/webRTC";
import verifyCall from "@/actions/call/verify";
import getUser from "@/actions/user/user";
import { iDispatch } from "@/types/dispatch";
import { iFriend } from "@/types/user";
import { socket } from "@/utils/socket";
import { peers, startStreaming } from "@/utils/webRTC";

export async function listenMessages(
  dispatch: iDispatch,
  call: iCallSlice | {},
  allFriends: iFriendSlice[],
  data: { event: string; payload: any }
) {
  if (data?.event) {
    switch (data?.event) {
      // listening and handling user offline

      //   case "user-offline":
      //     if (
      //       data?.payload?.id &&
      //       openChat.currentUniqueUserId == data?.payload?.id
      //     ) {
      //       openChat.setCurrentUserOnline(false);
      //     }
      //     break;

      // listening to user online

      //   case "user-online":
      //     if (
      //       data?.payload?.id &&
      //       openChat.currentUniqueUserId == data?.payload?.id
      //     ) {
      //       openChat.setCurrentUserOnline(true);
      //     }
      //     break;

      // listening to requested user online response

      //   case "user-online-response":
      //     if (
      //       data?.payload?.id &&
      //       openChat.currentUniqueUserId == data?.payload?.id
      //     ) {
      //       console.log("user online resopnse");

      //       openChat.setCurrentUserOnline(true);
      //     }
      //     break;

      //
      // listen to user message
      case "message-recieved":
        if (data?.payload?.from && data?.payload?.text) {
          let isfriend = allFriends.filter(
            (f) => f?.detail?.id == data?.payload?.from
          );
          if (isfriend[0]) {
            return dispatch(
              updateChats({
                id: isfriend[0]?.detail?.id,
                chats: {
                  text: data?.payload?.text,
                  time: data?.payload?.time,
                  from: data?.payload?.from,
                  status: "unread",
                },
              })
            );
          }
          const friend = await getUser(data?.payload?.from);
          if (!friend?.success) return;
          return (
            friend?.user &&
            dispatch(
              updateFriends({
                detail: friend.user,
                messages: [
                  {
                    text: data?.payload?.text,
                    time: data?.payload?.time,
                    from: data?.payload?.from,
                    status: "unread",
                  },
                ],
              })
            )
          );
        }

        break;
      //
      //
      //   case "message-read-recieved":
      //     if (data?.payload?.id) {
      //       const chatupdated: icurrentUserChats[] =
      //         openChat?.allUserChats &&
      //         openChat?.allUserChats[openChat?.currentUniqueUserId]?.map(
      //           (chat) => {
      //             if (
      //               chat?.type == "reciever" &&
      //               chat?.status == "unread"
      //             ) {
      //               return { ...chat, status: "read" };
      //             }
      //             return chat;
      //           }
      //         );

      //       openChat?.setAllUserChats({
      //         ...openChat?.allUserChats,
      //         [openChat?.currentUniqueUserId]: chatupdated,
      //       });
      //     }
      //     break;
      //
      // listening to user typing event
      //   case "message-recieved-start-typing":
      //     if (data?.payload?.id) {
      //       if (openChat.typing) {
      //         openChat.setTyping({
      //           ...openChat?.typing,
      //           [data?.payload?.id]: true,
      //         });
      //         setTimeout(() => {
      //           openChat.setTyping({
      //             ...openChat?.typing,
      //             [data?.payload?.id]: false,
      //           });
      //         }, 1000);
      //       } else {        console.log("message-send", JSON.stringify(data), ws.id);

      //         openChat.setTyping({ [data?.payload?.id]: true });
      //         setTimeout(() => {
      //           openChat.setTyping({ [data?.payload?.id]: false });
      //         }, 2500);
      //       }
      //     }
      //     break;
      //
      // call recieved from a friend
      case "call-received":
        if (data?.payload?.id && data?.payload?.type && data?.payload?.from) {
          const verifyCaller = await verifyCall(data?.payload?.id);
          if (verifyCaller?.success) {
            dispatch(
              setCall({
                id: data?.payload?.id,
                user: verifyCaller?.call?.caller,
                isAnswered: false,
                isSender: false,
                type: data?.payload?.type,
              })
            );
          }
        }
        break;
      // call answer revieved from reciever
      case "call-answer-received":
        if (data?.payload?.id) {
          if (data?.payload?.accepted) {
            dispatch(callAnswered());
            // dispatch(initializeWebRTCpeers())
            // dispatch(startStreaming(data?.payload?.type))
            startStreaming(data?.payload?.type);
          } else {
            dispatch(callRejected());
          }
        }
        break;
      //
      // Call offer from sender
      case "call-offer-received":
        if (data?.payload?.id && data?.payload?.type && data?.payload?.offer) {
          await peers?.receiver?.setRemoteDescription(data?.payload?.offer);
          let answer = await peers?.receiver?.createAnswer();
          await peers?.receiver?.setLocalDescription(answer);
          socket.send(
            JSON.stringify({
              event: "call-offer-answer",
              payload: {
                id: data?.payload?.id,
                type: (call as iCallSlice)?.type,
                answer: peers?.receiver?.localDescription,
              },
            })
          );
        }
        break;

      // sender part: listening to senders call offer answer sent earlier
      case "call-offer-answer-recieved":
        if (data?.payload?.id && data?.payload?.type && data?.payload?.answer) {
          await peers?.sender?.setRemoteDescription(data?.payload?.answer);
        }

        break;

      // recieving iveCandidate from sender and reciever
      case "call-iceCandidate-recieved":
        if (data?.payload?.iceCandidate && data?.payload?.from) {
          if (data?.payload?.from == "receiver") {
            await peers?.sender?.addIceCandidate(data?.payload?.iceCandidate);
          }
          if (data?.payload?.from == "sender") {
            await peers?.receiver?.addIceCandidate(data?.payload?.iceCandidate);
          }
        }
        break;
      
      // Cleanup on call end
      case "call-ended":
        if (data?.payload?.id) {
          dispatch(callRejected());
          peers?.sender?.close();
          peers?.receiver?.close();
          peers.sender = new RTCPeerConnection();
          peers.receiver = new RTCPeerConnection();
        }
        break;
      //
      default:
        console.log("no event found");

        break;
    }
  } else {
    console.log("no event found");
  }
}
