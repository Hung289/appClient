/* eslint-disable require-yield */
import {takeEvery} from 'redux-saga/effects';

function* helloUser(action) {
    console.log('Hello helloUser');
    console.log(action);
}

export default function* helloSaga() {
    console.log('Hello Saga');
    yield takeEvery('LOAD_USER', helloUser);
}
