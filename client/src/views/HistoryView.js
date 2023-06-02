import React from 'react'

// componentes
import DataHistoryTable from '../components/DataHistoryTable'
import Layout from '../components/layout/Layout'
import LineChart from '../components/LineChart'
import BarChart from '../components/BarChart'

const HistoryView = () => {
  return (
    <Layout>
        <div className="px-6">
            <h1>Reportes de datos</h1>
            
            <div className='grid'>
                <div className='col-6'>
                    <BarChart />
                </div>

                <div className='col-6'>
                    <LineChart />
                </div>
            </div>

            <div className='my-6'>
                <DataHistoryTable />
            </div>
        </div>

    </Layout>
  )
}

export default HistoryView