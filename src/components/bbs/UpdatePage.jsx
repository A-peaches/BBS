import React, { useEffect, useState } from 'react'
import {Row, Col, Form, Button} from 'react-bootstrap'
import {app} from '../../firebaseInit'
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore'
import { useParams, useNavigate } from 'react-router-dom'
import moment from 'moment'

const UpdatePage = () => {
    const navi = useNavigate();
    const [form, setForm] = useState({
            contents:'',
            title:'',
            email:'',
            date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            updateDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        });
    const [loading, setLoading] = useState(false);    
    const {contents, title} = form;    
    const db = getFirestore(app);
    const {id} =useParams();
    const callAPI = async() => {
        setLoading(true);
        const res=await getDoc(doc(db, `/posts/${id}`));
        //console.log(res.data());
        setForm(res.data());
        setLoading(false);
    }

    useEffect(()=>{
        callAPI();
    }, []);

    const onCancel=()=> {
        navi(-1);
    }

    const onChangeForm = (e) => {
        setForm({...form, [e.target.name]:e.target.value});
    }

    const onClickUpdate = async() => {
        setLoading(true);
        if(!window.confirm(`ID : ${id} 게시글을 수정하실래요?`)) return;
        //게시글 수정
        await updateDoc(doc(db, `posts/${id}`), {...form, updateDate:moment(new Date()).format('YYYY-MM-DD HH:mm:ss')});
        window.location.href=`/bbs/read/${id}`;
        setLoading(false);
    }

    if(loading) return <h1 className='my-5'>로딩중 입니다.....</h1>
    return (
        <Row className='my-5 justify-content-center'>
            <Col xs={12} md={10} lg={8}>
                <h1>글수정</h1>
                <div className='mt-5'>
                    <Form.Control name='title' value={title} onChange={onChangeForm}
                        className='mb-2' placeholder='제목을 입력하세요.'/>
                    <Form.Control name='contents' value={contents} onChange={onChangeForm}
                        as='textarea' rows={10} placeholder='내용을 입력하세요.'/>
                    <div className='text-center mt-3'>
                        <Button onClick={onClickUpdate}
                            variant="success" className='px-5 me-2'>수정</Button>
                        <Button onClick={onCancel}
                        variant="danger" className='px-5'>취소</Button>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default UpdatePage