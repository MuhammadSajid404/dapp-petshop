import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import petListJson from '../pets.json'
import { adoptPet, releasePet } from '../store/adoptSlice'
import { Adopters } from './Adopters'

export const PetList = () => {

    const dispatch = useDispatch()
    // const address = useSelector((state) => {
    //     return state.adoptReducer.address
    // })

    // const contract = useSelector((state) => {
    //     return state.adoptReducer.contract
    // })

    const { adoptInProgress, adoptError, adoptErrorMessage, adopters, address } = useSelector((state) => {
        return state.adoptReducer
    })

    return (
        <div>
            <Adopters />
            {
                adoptInProgress ?
                    <div>
                        <img alt="progress" src="images/progress.gif" style={{ width: '50px' }} />
                    </div> : null
            }
            {
                adoptError ?
                    <div>
                        <p style={{ color: 'red' }}>{adoptErrorMessage}</p>
                    </div> : null
            }
            {
                petListJson.map((item) => (
                    <div key={item.id} style={{ border: '1px solid blue', display: 'inline-block', padding: '15px', margin: '10px' }}>
                        <div>
                            <h3>{item.name}</h3>
                        </div>
                        <div>
                            <img alt='140x140' style={{ width: '200px' }} src={item.picture} />
                            <br /><br />
                            <strong>Breed</strong>: <span>Golden Retriever</span><br />
                            <strong>Age</strong>: <span>3</span><br />
                            <strong>Location</strong>: <span>Warren, MI</span><br /><br />
                            <div>{adopters[item.id]}</div>
                            <div>
                                {
                                    adopters[item.id] === '0x0000000000000000000000000000000000000000' ?
                                        <button type="button" onClick={() => {
                                            // console.log("id: ", item.id) 

                                            dispatch(adoptPet(item.id))
                                            // const result = await contract.methods.adopt(item.id).send({from: address})
                                            // console.log('result: ', result)

                                            // const adopterList = await contract.methods.getAdopters().call()
                                            // console.log('adopters: ', adopterList)
                                        }}>Adopt</button> :
                                        adopters[item.id] === address ?
                                            <div>
                                                <button type="button" disabled style={{ marginRight: '20px' }}>Adopted</button>
                                                <button type="button" onClick={() => { dispatch(releasePet(item.id)) }}>Release</button>
                                            </div> : <div>
                                                <button type="button" disabled style={{ marginRight: '20px' }}>Adopted</button>
                                            </div>
                                }
                            </div>
                            {/* <button type="button" onClick={() => {
                                console.log("id: ", item.id)
                                dispatch(releasePet(item.id))
                            }}>UnAdopt</button> */}

                        </div>
                    </div>
                ))
            }
        </div>
    )
}
