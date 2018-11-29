import uuid from 'uuid';
import database from './../firebase/firebase';

//ADD_EXPENSE

export const addExpense = (expense) => (        {
        type: 'ADD_EXPENSE',
        expense:expense
});

export const startAddExpense = (expenseData = {}) =>{
        return (dispatch, getState) => {
                const uid = getState().auth.uid;
                const {
                        description = '', 
                        notes = '', 
                        amount = 0, 
                        createdAt = 0
                } = expenseData;
                const expense = { description, notes, amount,createdAt}
                return database.ref(`users/${uid}/expenses`).push(expense).then( (ref) => {
                        dispatch(addExpense({
                                id:ref.key,
                                ...expense
                        }))
                });
        };
};
//REMOVE_EXPENSE
export const removeExpense = ({id} = {}) => ({
        type: 'REMOVE_EXPENSE',
        id
});
    
//EDIT_EXPENSE
export const editExpense = (id,updates) => ({
        type: 'EDIT_EXPENSE',
        id,
        updates
});

// SET_EXPENSES
export const setExpenses = (expenses) => ({
        type: 'SET_EXPENSES',
        expenses
});

//export const startSetExpenses;
export const startSetExpenses = () =>{
        return(dispatch,getState)=>{
                const uid = getState().auth.uid;
                return database.ref(`users/${uid}/expenses`).once('value').then((snapshot)=>{    
                        const expenses = [];
                        snapshot.forEach((childSnapshot)=>{
                                expenses.push({
                                        id:childSnapshot.key,
                                        ...childSnapshot.val()
                                });
                        });
                        dispatch(setExpenses(expenses));
                });
        };
        
};
// removeExpenses
export const startRemoveExpense = (expense) =>{
        return(dispatch,getState) =>{
                const uid = getState().auth.uid;
                return database.ref(`users/${uid}/expenses/${expense.id}`).remove(()=>{
                        dispatch(removeExpense({id:expense.id}));
                });    
        };
};
//start edit expense
export const startEditExpense = (id,updates) =>{
        return(dispatch,getState) =>{
                const uid = getState().auth.uid;
                return database.ref(`users/${uid}/expenses/${id}`).update({
                        notes: updates.notes?updates.notes:'',
                        amount: updates.amount,
                        createdAt: updates.createdAt,
                        description: updates.description
                }).then(()=>{
                        dispatch(editExpense(id,updates));
                });
                
        };
};