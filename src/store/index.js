import {createStore, combineReducers, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import authReducer from './reducers/auth';
import tinTucReducer from './reducers/tinTucReducer';
import bannerReducer from './reducers/bannerReducer';
import categoryNewsReducer from './reducers/categoryNewsReducer';
import HoiDapReducer from './reducers/HoiDapReducer';
import dangKyHienTangReducer from './reducers/dangKyHienTangReducer';
import dangKyChoGhepTangReducer from './reducers/dangKyChoGhepTangReducer';
import ChoGhepTangDaTiepNhanReducer from './reducers/ChoGhepTangDaTiepNhanReducer';
import ChoGhepTangDaTuChoiReducer from './reducers/ChoGhepTangDaTuChoiReducer';
import ChoGhepTangDaHuyReducer from './reducers/ChoGhepTangDaHuyReducer';

import ChoGhepTangChoTiepNhanReducer from './reducers/ChoGhepTangChoTiepNhanReducer';
import dangKyHienTangChoTiepNhanReducer from './reducers/HienChoTuepNhanReducer';
import HienDaTiepNhanReducer from './reducers/HienDaTiepNhanReducer';
import HienDaTuChoiReducer from './reducers/HienDaTuChoiReducer';
import HienHuyDangKyReducer from './reducers/HienHuyDangKyReducer';
import AccountReducer from './reducers/AccountReducer';
import ProfileReducer from './reducers/ProfileReducer';
import duLieuDanhMucReducer from './reducers/duLieuDanhMucReducer';
import DMNhomReducer from './reducers/DMNhomDanhMucReducer';
import OperationReducer from './reducers/operationReducer';
import RoleReducer from './reducers/RoleReducer';
import ModuleReducer from './reducers/ModuleReducer';
import DataTokenReducer from './reducers/dataTokenReducer';
import Diachi from './reducers/Diachi';
import TinhReducer from './reducers/TINHReducer';
import HuyenReducer from './reducers/HUYENReducer';
import XaReducer from './reducers/XAReducer';
import ToPhuTrachReducer from './reducers/ToPhuTrachReducer';
import commonConfigReducer from './reducers/commonConfigReducer';
import KQXetNghiemReducer from './reducers/KQXetNghiemReducer';
import rootSaga from './sagas/sagas';

const rootReducer = combineReducers({
    auth: authReducer,
    tintuc: tinTucReducer,
    banner: bannerReducer,
    categoryNews: categoryNewsReducer,
    hoidap: HoiDapReducer,
    dangkyhientang: dangKyHienTangReducer,
    dangkyhientangchotiepnhan: dangKyHienTangChoTiepNhanReducer,
    dangkyhiendatiepnhan: HienDaTiepNhanReducer,
    dangkyhienhuydangky: HienHuyDangKyReducer,
    dangkyhiendatuchoi: HienDaTuChoiReducer,
    dangkychogheptang: dangKyChoGhepTangReducer,
    dangkychoghepdatiepnhan: ChoGhepTangDaTiepNhanReducer,
    dangkychoghepdatuchoi: ChoGhepTangDaTuChoiReducer,
    dangkychoghepdahuy: ChoGhepTangDaHuyReducer,
    dangkychoghepchotiepnhan: ChoGhepTangChoTiepNhanReducer,
    account: AccountReducer,
    profile: ProfileReducer,
    dulieudanhmuc: duLieuDanhMucReducer,
    dmnhom: DMNhomReducer,
    role: RoleReducer,
    operation: OperationReducer,
    module: ModuleReducer,
    datatoken: DataTokenReducer,
    tinh: TinhReducer,
    huyen: HuyenReducer,
    xa: XaReducer,
    tophutrach: ToPhuTrachReducer,
    diachi: Diachi,
    // kqxetnghiem: KQXetNghiemReducer,
    commonConfig: commonConfigReducer
});
const sagaMiddleWare = createSagaMiddleware();

// const store = createStore(rootReducer, applyMiddleware(sagaMiddleWare));
const store = createStore(rootReducer);
// sagaMiddleWare.run(rootSaga);
export default store;
