import io from "socket.io-client";

export function useSocket() {
    const url = process.env.NEXT_PUBLIC_API_PRICE
    //@ts-ignore
    const limitOrderSocket = io.connect(url);
    // const limitOrderSocket = io("http://localhost:4000", {transports: ['websocket'], upgrade: false});
    return {limitOrderSocket}
}

// eslint-disable-next-line react-hooks/rules-of-hooks
const socketInstance = useSocket();

// export const getLIstOrderRealTime = async () => {
//     socketInstance.limitOrderSocket.on("", data => {
//     })
// }
export default socketInstance

