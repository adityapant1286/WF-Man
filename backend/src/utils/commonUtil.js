import _ from 'lodash';

export const isAllEmpty = (...v) => {
    let _arr = v;
    if (!_.isArray(v)) {
        _arr = [v];
    }

    const _res = _arr.filter((e) => !_.isEmpty(e));

    return _res.length === 0;
};

export const isAnyEmpty = (...v) => {
    let _arr = v;
    if (!_.isArray(v)) {
        _arr = [v];
    }

    let _anyEmpty = false;

    for (let i = 0; i < _arr.length; i++) {
        if (_.isEmpty(_arr[i])) {
            _anyEmpty = true;
            break;
        }
    }

    return _anyEmpty;

};

