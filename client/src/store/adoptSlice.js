import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Web3 from "web3";
import Adoption from '../contracts/Adoption'

export const initWeb3 = createAsyncThunk(
    'InitWeb3',
    async (a, thunkAPI) => {
        console.log('initWeb3 a: ', a)
        console.log('initWeb3 thunkapi: ', thunkAPI)
        console.log('initWeb3 dispatch: ', thunkAPI.dispatch)
        try {

            if (Web3.givenProvider) {
                const web3 = new Web3(Web3.givenProvider)
                await Web3.givenProvider.enable();
                web3.eth.handleRevert = true;

                const networkId = await web3.eth.net.getId();
                const network = Adoption.networks[networkId];
                const contract = new web3.eth.Contract(Adoption.abi, network.address)
                const addresses = await web3.eth.getAccounts()
                thunkAPI.dispatch(loadAdopters({
                    contract: contract,
                    address: addresses[0]
                }))
                console.log(addresses);

                return {
                    web3: web3,
                    contract: contract,
                    address: addresses[0],
                }
            }
            else {
                console.log('Error In Loading Web3')
            }
        }
        catch (err) {
            console.log('Error In Loading')
        }
    }
)

export const loadAdoptersList = createAsyncThunk(
    'LoadAdopters',
    async (a, thunkAPI) => {
        console.log('in loadAdopters a = ', a);
        console.log('in loadAdopters thunkApi = ', thunkAPI);
        console.log('in loadAdopters thunkApi state = ', thunkAPI.getState());
        const contract = thunkAPI.getState().adoptReducer.contract;
        console.log('loadadopters contract = ', contract);
        const adoptersList = await contract.methods.getAdopters().call()
        return adoptersList
    }
)
export const loadAdopters = createAsyncThunk(
    "LoadAdopters",
    async(data,thunkAPI)=>{
        const adopterList = await data.contract.methods.getAdopters().call();
        return adopterList;
    }
)

export const adoptPet = createAsyncThunk(
    "AdoptPet",
    async (petIndex, thunkAPI) => {
        console.log("Hello in adopt pet");
        console.log(" in adopt pet petIndex = ", petIndex);
        console.log(" in adopt pet thunkAPI = ", thunkAPI);
        console.log(" in adopt pet c = ", thunkAPI.getState());
        const contract = thunkAPI.getState().adoptReducer.contract;
        const address = thunkAPI.getState().adoptReducer.address;

        //const { contract, address} = thunkAPI.getState().adoptReducer;
        const result = await contract.methods.adopt(petIndex).send({ from: address });
        console.log("after adopt result = ", result);

        // thunkAPI.dispatch(loadAdopters())
        // after doing this no need to return anything
        return {
            adopterAddress: result.from,
            petIndex: petIndex
        };

    }
);

export const releasePet = createAsyncThunk(
    "ReleasePet",
    async(petIndex, thunkAPI) => {
        console.log('release pet index: ', petIndex);
        console.log('relese pet thunkAPI: ', thunkAPI);
        console.log('releasePet: thunkAPI state = ', thunkAPI.getState());

        const { contract, address } = thunkAPI.getState().adoptReducer;

        const result = await contract.methods.deleteAdopter(petIndex).send({ from: address }).catch(console.log)
        console.log('after releasing result: ', result)

        return {
            unAdopterAddress: result.from,
            petIndex: petIndex
        }
    }
)


const adoptSlice = createSlice({
    name: 'AdoptSlice',
    initialState: {
        web3: null,
        contract: null,
        address: null,
        adopters: [],
        adoptInProgress: false,
        adoptError: false,
        adoptErrorMessage: '',
        releasingPetStatus: false,
        releasePetError: '',
        releaseErrorMessage: '',
        error: null,
    },
    reducers: {
        adopt: () => { }
    },
    extraReducers: {
        [initWeb3.fulfilled]: (state, action) => {
            console.log("In fullfil = ", state);
            console.log("In fullfil = ", action);
            state.web3 = action.payload.web3;
            state.contract = action.payload.contract;
            state.address = action.payload.address;
        },
        [loadAdopters.fulfilled]: (state, action) => {
            state.adopters = action.payload
        },
        [adoptPet.fulfilled]: (state, action) => {
            console.log("Adopt pet fullfile state = ", state);
            console.log("Adopt pet fullfile action = ", action);
            state.adopters[action.payload.petIndex] = action.payload.adopterAddress;
            state.adoptInProgress = false;
            state.adoptError = false;
        },
        [adoptPet.pending]: (state, action) => {
            console.log("Adopt pet pending state = ", state);
            console.log("Adopt pet pending action = ", action);
            state.adoptInProgress = true;
        },
        [adoptPet.rejected]: (state, action) => {
            console.log("Adopt pet rejected state = ", state);
            console.log("Adopt pet rejected action = ", action);
            state.adoptInProgress = false;
            state.adoptError = true;
            state.adoptErrorMessage = action.error.message;
            state.error = action.error.message;
            console.log('adopt pet rejected error: ', action);
        },
        [releasePet.pending]: (state, action) => {
            console.log("release pet pending state = ", state);
            console.log("release pet pending action = ", action);
            state.releasingPetStatus = true;
        },
        [releasePet.fulfilled]: (state, action) => {
            console.log("release pet fulfilled state = ", state)
            console.log("release pet fulfilled action = ", action)
            state.adopters[action.payload.petIndex] = action.payload.unAdopterAddress;
            state.releasingPetStatus = false;
        },
        [releasePet.rejected]: (state, action) => {
            console.log("release pet rejected state = ", state);
            console.log("release pet rejected action = ", action);
            // console.log('release pet detail = ', action.error.message)
            state.releasingPetStatus = false;
            state.releasePetError = action.error.message.Error;
            console.log(state.releasePetError);
            // state.error = action.error.message;
            console.log('release pet rejected error: ', action.error.message);
            state.releasingError = true
        }
    }
})

export const adopReducer = adoptSlice.reducer;
export const { adopt } = adoptSlice.actions;