import io from "socket.io-client";

export const socketInstance = (function () {
    var instance;
    function init() {
      instance = io(process.env.NEXT_PUBLIC_API_NFT);
      return instance;
    }
  
    return {
      getInstance: function () {
        if (!instance) instance = init();
        return instance;
      },
      clearInstance: function () {
        instance = null;
      },
    };
  })();