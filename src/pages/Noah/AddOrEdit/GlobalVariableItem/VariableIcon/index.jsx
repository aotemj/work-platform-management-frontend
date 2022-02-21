import {GLOBAL_VARIABLE_TYPE} from '../../constants';
import IconFont from '../../../../../components/Iconfont';

const VariableIcon = ({type}) => {
    const {STRING, SECRET_KEY} = GLOBAL_VARIABLE_TYPE;
    switch (type) {
        case STRING.value:
            return <div>Str.</div>;
        case SECRET_KEY.value:
            return <IconFont type={'iconlock_password'} />;
    }
};


export default VariableIcon;
