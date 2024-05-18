import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseInit';
import {getDatabase ,onValue, ref , remove} from 'firebase/database';
import { Table ,Button } from 'react-bootstrap'

const Favorite = () => {
    const [loading, setLoading] = useState(false);
    const db = getDatabase(app);
    const uid = sessionStorage.getItem('uid');
    const [locals, setLocals] = useState([]);
    
    const callAPI = () => {
        setLoading(true);
        onValue(ref(db,`favorite/${uid}`), sanpshot=>{
            let rows = [];
            sanpshot.forEach(row=>{
                rows.push({...row.val()});
            });
        // console.log(rows);
        setLocals(rows);
        setLoading(false);
        });
    }
        
    const onClickDelete = async (local) => {
        if(window.confirm(`[${local.place_name}]\n즐겨찾기를 취소하실래요?`)){
            setLoading(true);
            await remove(ref(db,`favorite/${uid}/${local.id}`));
            setLoading(false);
        }
    }

    useEffect(()=>{
        callAPI();
    },[])

    if(loading) return <h1 className="my-5">로딩중입니다....</h1>
    return (
        <div>
        <h1 className='my-5'>즐겨찾기</h1>
        <Table striped bordered hover>
        <thead>
            <tr className='text-center'>
                <td className='fw-bold'>ID</td>
                <td className='fw-bold'> 장소명</td>
                <td className='fw-bold' >주소</td>
                <td className='fw-bold'>전화번호</td>
                <td className='fw-bold'>취소</td>
            </tr>
        </thead>
        <tbody>
            {locals.map(local=>
                <tr key={local.id}>
                    <td>{local.id}</td>
                    <td>{local.place_name}</td>
                    <td>{local.road_address_name === "" ? local.address_name : local.road_address_name}</td>
                    <td>{local.phone}</td>
                    <td className='text-center'><Button className="btn btn-danger"
                    onClick={()=>onClickDelete(local)}>취소</Button></td>
                </tr>
                )}
        </tbody>
       </Table>
        </div>
    )
}

export default Favorite
