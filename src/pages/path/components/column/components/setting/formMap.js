import formApplyMap from '@/pages/column/apply/formMap';
import formMap from '@/components/Form/map';
const { Name, Desc } = formApplyMap;
const { Path } = formMap;

export default {
    Name,
    Avatar: {
        props: {
            type: 'hidden',
        },
    },
    Desc,
    Path,
};
