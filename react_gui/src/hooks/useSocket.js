import { useState, useEffect } from "react";


// Custom websocket hook, host = url to the server
const useSocket= (host) => {
    const [webSocket, setWebSocket] = useState(null);
    const [data, setData] = useState(null);
    const [isConnect, setIsConnected] = useState(false);
    const [timer, setTimer] = useState(null)


    //function to handle websocket connection
    function connectWebSocket() {
        const ws = new WebSocket(host);

        //connect to server
        ws.onopen = () => {
            setWebSocket(ws);
            setIsConnected(true);
            console.log('connected')
            setTimer(clearTimeout(timer))
        }

        //whenever server sends a message 
        ws.onmessage = (event) => {
            if (event.data !== 'No Data') {
                let event_data = JSON.parse(event.data);
                setData(event_data);
            } 
            else {
                setData(undefined)
            }
        }

        //error handling
        ws.onerror = (err) => {
            console.log(err);
        }

        //close connection to server - triggers when connection to server is lost
        ws.onclose = () => {
            setWebSocket(null);
            setIsConnected(false);
            //attempts to reconnect every 2 seconds
            setTimer(setTimeout(() => {
                console.log('Reconnecting...');
                connectWebSocket();
            }, 2000))
        }

    }

    useEffect(() => {
        if(!isConnect) {
            connectWebSocket();
        }
    }, [isConnect])

    return { data, isConnect, webSocket }
}

export default useSocket;