import React from 'react';

const Title = (props: any) => {
    return (
        <div className="form-title mt-4 mb-5">
            <h3 data-title={props.sub}>project</h3>
        </div>
    );
};

export default Title;
