import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Col,
  InputGroup,
  Row,
  Table,
  Card,
} from "react-bootstrap";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { app } from "../../firebaseInit";
import Comments from "./\bComments";
const ReadPage = () => {
    const navi = useNavigate();
    const loginEmail = sessionStorage.getItem("email");
    const [post, setPost] = useState("");
    const { id } = useParams();
    //   console.log(id);
    const db = getFirestore(app);

    const { email, updateDate, date, title, contents } = post;
    const callAPI = async () => {
        const res = await getDoc(doc(db, `posts/${id}`));
        console.log(res.data);
        setPost(res.data());
    };

    useEffect(() => {
        callAPI();
    }, []);

    const onClickDelete = async () => {
        if(!window.confirm(`ID : ${id} 게시글을 삭제하실래요?`)) return;
        //게시글 삭제
        await deleteDoc(doc(db, `/posts/${id}`));
        //window.location.href='/bbs'; 두가지 방법이 있음 이거랑 밑에 navi
        navi('/bbs'); // 이건 위에 navi 지정해줘야함
    }

    return (
        <Row className="my-5 justify-content-center">
        <Col xs={12} md={10} lg={8}>
            <h1 className='mb-5'>게시글 정보</h1>
            {loginEmail==email &&
                <div className='text-end mb-3'>
                    <Button onClick={()=>navi(`/bbs/update/${id}`)}
                        variant='warning' className='me-2 px-3'>수정</Button>
                    <Button onClick={onClickDelete}
                        variant='danger' className='px-3'>삭제</Button>
                </div>
            }
            <Card>
            <Card.Body>
                <h5>{title}</h5>
                <div className="text-muted">
                    <span className='me-3'>작성자 : {email}</span>
                    <br/>
                    <span>작성일 : {date}</span>
                    {/* updateDate가 있을때만 보임 */}
                    <span>{updateDate && ` / 수정일 : ${updateDate}`}</span>
                </div>
                <hr />
                <div>{contents}</div>
            </Card.Body>
            </Card>
            <Comments/>
        </Col>
        </Row>
    );
};

export default ReadPage;