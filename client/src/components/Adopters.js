import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadAdoptersList } from '../store/adoptSlice'

export const Adopters = () => {
    const dispatch = useDispatch()
    const adoptersList = useSelector((state) => {
        return state.adoptReducer.adopters
    })

    useEffect(() => {

        const interval = setInterval(() => {
            dispatch(loadAdoptersList())
            console.log('updated')
        }, 2000)
        return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    return (
        <div style={{ marginLeft: '10px' }}>
            <div style={{fontWeight: 'bolder'}}>Adopters List</div>
            <div>
                {
                    adoptersList.map((list, index) => (
                        list !== '0x0000000000000000000000000000000000000000' ? <div key={index}>index {index} : {list}</div> : null
                    ))
                }
            </div>
        </div>
    )
}
