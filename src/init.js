var _nodes = [
    {
        title: 'Add',
        namespace: 'Math',
        in: {
            value1: 'String|Number',
            value2: 'String|Number'
        },
        out: {
            result: 'String|Number'
        }
    },
    {
        title: 'Subtract',
        namespace: 'Math',
        in: {
            value1: 'String|Number',
            value2: 'String|Number'
        },
        out: {
            result: 'String|Number'
        }
    },
    {
        title: 'Concatenate',
        namespace: 'String',
        in: {
            value1: 'String',
            value2: 'String'
        },
        out: {
            result: 'String'
        }
    },
    {
        title: 'Console',
        namespace: 'Output',
        in: {
            value: 'String|Number'
        }
    }
];

/**
 * @namespace Math
 * @name Add
 * @arg {
 *      name: 'A',
 *      type: 'Number'
 * }
 * @arg B Number
 * @return Number
 * @description 
 * @call Add
 */
function Add(a, b){

}