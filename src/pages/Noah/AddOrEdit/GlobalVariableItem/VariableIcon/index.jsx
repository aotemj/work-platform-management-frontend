import {GLOBAL_VARIABLE_TYPES} from '../../constants';
import IconFont from '../../../../../components/Iconfont';

const VariableIcon = ({type}) => {
    const {STRING, SECRET_KEY} = GLOBAL_VARIABLE_TYPES;
    switch (type) {
        case STRING.value:
            return <div>Str.</div>;
        case SECRET_KEY.value:
            return <IconFont type={'iconlock_password'} />;
    }
};


export default VariableIcon;
