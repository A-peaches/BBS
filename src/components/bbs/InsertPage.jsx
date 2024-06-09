import React, { useState } from 'react'
import {Row, Col, Form, Button} from 'react-bootstrap'
import { getFirestore, collection, addDoc} from 'firebase/firestore';
import {app} from '../../firebaseInit';
import moment from 'moment/moment';
import { useNavigate } from "react-router-dom";

const InsertPage = () => {
    const navi = useNavigate();
    const db = getFirestore(app);
    const [form, setForm] = useState({
        title : '',
        contents : '',
    });

    const {title, contents} = form; // 비구조할당
    const onChangForm = (e) => {
        setForm({
            ...form, [e.target.name]: e.target.value
        })
    }

    const onCancel =() => {
        navi(-1);
    }

    const onInsert = async()=> {
        if(title==="" || contents ==="") {
            alert('제목과 내용을 입력하세요!');
            return;
        }

        if(!window.confirm('등록하시겠습니까?')) return;
        //게시글 등록
        const data={
            email:sessionStorage.getItem('email'),
            title,
            contents,
            date : moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        }
        // console.log(data);
        await addDoc(collection(db,'posts'),data);
        alert('게시글 등록 완료!');
        window.location.href ='/bbs'
    }
    return (
        <Row className='my-5 justify-content-center'>
            <Col xs={12} md={10} lg={8}>
                <h1>글쓰기</h1>
                <div className='mt-5'>
                    <Form.Control name='title' value={title}
                    onChange={onChangForm} placeholder='제목을 입력하세요'/>
                    <Form.Control name='contents' value={contents}
                     onChange={onChangForm} className='mt-2' rows={10} as="textarea" placeholder='내용을 입력하세요'/>
                    <div className='text-center mt-3'>
                        <Button onClick={onInsert} 
                        variant='success' className="mx-2 me-2 px-5">등록</Button>
                        <Button onClick={onCancel} variant='danger' className="px-5">취소</Button>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default InsertPage
