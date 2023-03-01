import React from 'react'

import { Panel } from 'primereact/panel';

const QuestionsPanel = (props) => {
    return (
        <Panel header={props.header} toggleable >
            <p className='m-0'>
                {props.content}
            </p>
        </Panel>
    )
}

export default QuestionsPanel