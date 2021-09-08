import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme) => ({
    profileCard: {
        borderRadius: '20px',
        margin: '2% 20% 0 20%',
        backgroundColor: '#202124',
        color: '#ffffff',
        textAlign: 'center',
        // height: '100%',
    },
    profileCard__up: {
        borderRadius: ' 20px  20px 0 0', //테두리 둥글게하기 위함.
        background: 'linear-gradient(90deg, #3389D4 30%, #EFBAA8 90%)',
        height: '20%',
    },
    profileCard__down: {
        margin: 'auto',
        width: '50%',
        display: 'flex',
        flexDirection: 'column',
        padding: '5%',
    },
    profileImg: {
        marginTop: '5%',
        marginBottom: '2%',
        width: '18rem',
        height: '18rem',
        border: '10px',
        borderRadius: '70%',
        boxShadow: '0px 0px 7px 8px rgba(0,0,0,0.5)',
    },
    formInput: {
        cursor: 'pointer',
        width: '100%',
        padding: '10px 20px',
        borderRadius: '20px',
        border: '2px solid black',
        textAlign: 'center',
        backgroundColor: 'white',
        // color: 'black',
        boxSizing: 'border-box',
        marginBottom: '3%',
    },
    formBtn: {
        cursor: 'pointer',
        width: '100%',
        padding: '10px 20px',
        border: '2px solid black',
        textAlign: 'center',
        // color: 'black',
        borderRadius: '20px',
        backgroundColor: '#0984e3',
        marginBottom: '3%',
        '&:hover': {
            border: 'solid',
            borderColor: 'grey',
            backgroundColor: '#74b9ff',
        },
    },

    cancelBtn: {
        cursor: 'pointer',
        width: '100%',
        padding: '10px 20px',
        border: '2px solid black',
        textAlign: 'center',
        // color: 'black',
        borderRadius: '20px',
        backgroundColor: '#d63031',
        marginBottom: '3%',
        '&:hover': {
            border: 'solid',
            borderColor: 'grey',
            backgroundColor: '#ff7675',
        },
    },
}));
