
export function generateOTP() {
    const characters = "0123456789";
    const randomOTP = Array.from(
      { length: 4 },
      () => characters[Math.floor(Math.random() * characters.length)]
    ).join("");
    return randomOTP;
  }


