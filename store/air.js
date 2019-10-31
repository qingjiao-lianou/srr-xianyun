
export const state = () => {
    return {
        airInfo: {
            seat_infos: {},
            
           
          
        },
        airPrice:0
     

    }
}

export const mutations = {
    setairInfo(state, data) {
        state.airInfo = data
    },
    setairPrice(state, price) {
        state.airPrice = price
    },
} 