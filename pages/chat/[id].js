import styled from "styled-components";
import Head from "next/head";
import Sidebar from "../../components/Sidebar";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientId from "../../utils/getRecipientId";
import ChatScreen from "../../components/ChatScreen";

function Chats ({chat , messages}) {
    
    const [user] = useAuthState(auth)
    return (
        <Container>
            <Head>
             
                <title>Chat with {getRecipientId(chat.users , user)}</title>
        

            </Head>
            
            <Sidebar/>
            <ChatContainer>
                 <ChatScreen chat={chat} messages={messages} /> 
            </ChatContainer>
        </Container>

    )
}

export default Chats;


 export async function getServerSideProps(context) {
     const ref = db.collection("chats").doc(context.query.id);
    
     // Prep the messages on the server
     const messagesRef = await ref.collection("messages")
     .orderBy("timestamp","asc")
     .get();

     const messages = messagesRef.docs.map((doc) => ({
         id: doc.id,
         ...doc.data(),
     })).map((messages) => ({
         ...messages,
         timestamp: messages.timestamp.toDate().getTime(),
     }));
    



    //Prep the Chats
     const chatRes = await ref.get();
     
    
     const chat = {
         id:chatRes.id,
         ...chatRes.data(),
     }

    return {
        props : {
            messages: JSON.stringify(messages),
            chat: chat,
        },
    };
}

const Container = styled.div`
display:flex;
`;

const ChatContainer = styled.div`
flex:1;
overflow: scroll;
height: 100vh;

::-webkit-scrollbar {
    display:none;
}
--ms-overflow-style: none;
scrollbar-width: none;

`;
