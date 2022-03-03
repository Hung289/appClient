/* eslint-disable require-yield */
/* eslint-disable import/prefer-default-export */
/* eslint-disable func-names */
import {takeEvery, all} from 'redux-saga/effects';
import hellosaga from './helloSaga';

export default function* rootSaga() {
    // yield takeEvery('HELLO', function* () {
    //     console.log('hello saga');
    // });
    yield all([hellosaga()]);
}
