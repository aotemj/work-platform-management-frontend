import {Tooltip} from '@osui/ui';
import {ReactComponent as IconInfo} from '../../statics/icons/info.svg';

const PromptTooltip = ({title}) => (
    <Tooltip
        title={title}
    >
        <IconInfo style={{verticalAlign: 'middle'}} />
    </Tooltip>
);

export default PromptTooltip;
