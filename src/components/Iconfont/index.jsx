import {createFromIconfontCN} from '@ant-design/icons';

const IconFont = createFromIconfontCN({
    scriptUrl: [import('./icon.js')],
});

export default IconFont;
