import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useState } from "react";

const config = {
    apiKey: "AIzaSyCyp4bLGirkoRLorYPxcYfZDggbRE3HoUo",
    authDomain: "odin-book-55d3e.firebaseapp.com",
    projectId: "odin-book-55d3e",
    storageBucket: "odin-book-55d3e.appspot.com",
    messagingSenderId: "1096222459518",
    appId: "1:1096222459518:web:72947e835c7495c80ffa2f",
    measurementId: "G-ZT1KFKL3V3",
};

const app = initializeApp(config);

const db = getFirestore(app);
const postsRef = collection(db, "Posts");

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const App = () => {
    const [user] = useAuthState(auth);
    const [post, setPost] = useState();
    const [posts] = useCollectionData(postsRef);

    return (
        <>
            {user ? (
                <div>
                    <div>
                        <p>Write a post</p>
                        <input
                            type="text"
                            placeholder="Your post text"
                            value={post}
                            onChange={(e) => setPost(e.target.value)}
                        />
                        <button
                            onClick={async (e) => {
                                const { displayName, photoURL } = user;

                                e.preventDefault();

                                await addDoc(postsRef, {
                                    text: post,
                                    author: displayName,
                                    image: photoURL,
                                });

                                setPost("");
                            }}
                        >
                            Post
                        </button>
                    </div>
                    {posts?.map((post, index) => {
                        const { text, author, image } = post;

                        return (
                            <div className="post-container" key={index}>
                                <div>
                                    <p>{author}</p>
                                    <img src={image} />
                                </div>
                                <p>{text}</p>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <button onClick={() => signInWithPopup(auth, provider)}>
                    Log in
                </button>
            )}
        </>
    );
};

export default App;
