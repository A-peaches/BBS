import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Row, Col, InputGroup, Form, Button } from 'react-bootstrap'
import { app } from '../../firebaseInit';
import { getDatabase, ref, set, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

const Locals = () => {
    const navi = useNavigate();
    const db = getDatabase(app);
    const uid = sessionStorage.getItem('uid');
    
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('인하대학교');
    const [locals, setLocals] = useState([]);
    const [loading, setLoading] = useState(false);

    const callAPI = async () => {
        setLoading(true);
        const url=`https://dapi.kakao.com/v2/local/search/keyword.json?query=${query}&size=10&page=${page}`;
        const config = {
            headers :{"Authorization":"KakaoAK 9a53a4e814c1a01fc67a897a5aaae978"}
        }
        const res = await axios.get(url, config);
        setLocals(res.data.documents);
        // console.log(res.data);
        setLoading(false);
    }
    const onSubmit = (e) => {
        e.preventDefault();
        if(query === "") {
            alert("검색어를 입력하세요!");
        } else {
            callAPI();
        }
    }

    const onClickFavorte = async (local) => {
        if(!uid) {
            alert('로그인이 필요합니다!');
            sessionStorage.setItem("target", "/locals");
            navi("/login");
            return;
        }
        if(window.confirm("즐겨찾기에 추가하실래요?")){
            // console.log(local);
            setLoading(true);
            await get(ref(db,`favorite/${uid}/${local.id}`)).then(async snapshot=>{
                if(snapshot.exists()) {
                    alert('이미 즐겨찾기에 등록되었습니다!');
                } else {
                    alert('즐겨찾기 등록 성공!');
                    await set(ref(db,`favorite/${uid}/${local.id}`), local);
                }
            })
            setLoading(false);
        }
    }

    useEffect(()=>{
        callAPI()
    },[page]);
    
    if(loading) return <h1 className='my-5'>로딩중입니다....</h1>
  return (
    <div>
       <h1 className='my-5'>지역검색</h1>
       <Row className="mb-2">
                <Col xs={8} md={6} lg={4} >
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control onChange={(e)=>setQuery(e.target.value)}
                            placeholder='검색어' value={query}/>
                            <Button type="submit" className="btn btn-warning">검색</Button>
                        </InputGroup>
                    </form>
                </Col>
            </Row>
       <Table striped bordered hover>
        <thead>
            <tr className='text-center'>
                <td className='fw-bold'>ID</td>
                <td className='fw-bold'> 장소명</td>
                <td className='fw-bold' >주소</td>
                <td className='fw-bold'>전화번호</td>
                <td className='fw-bold'>즐겨찾기</td>
            </tr>
        </thead>
        <tbody>
            {locals.map(local=>
                <tr key={local.id}>
                    <td>{local.id}</td>
                    <td>{local.place_name}</td>
                    <td>{local.road_address_name === "" ? local.address_name : local.road_address_name}</td>
                    <td>{local.phone}</td>
                    <td className='text-center'><Button className="btn btn-success"
                    onClick={()=>onClickFavorte(local)}>즐겨찾기</Button></td>
                </tr>
                )}
        </tbody>
       </Table>
       <div className="text-center my-3">
                <Button onClick={()=>setPage(page-1)} disabled={page===1} className="btn btn-warning">이전</Button>
                <span className="mx-3">{page}</span>
                <Button onClick={()=>setPage(page+1)} className="btn btn-warning">다음</Button>
            </div>
    </div>
  )
}

export default Locals
