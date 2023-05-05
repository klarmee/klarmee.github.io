import data from './data.js';
const infoIndex = data.length

export default function InfoSection() {
    return (
        <section key={infoIndex} className='info'>
            <ol>
                {
                    data[0].entries.map((entry, index) => {
                        const entryLength = Object.keys(entry).length - 2
                        return (
                            <li key={index}><span>{index+1 +'. '}</span>
                                {
                                    Object.entries(entry).map(([key, value], index) => {
                                        if (key !== 'url') {
                                            return (
                                                <span key={index}>
                                                    {value}{index === entryLength ? ' ' : ', '}
                                                </span>
                                            )
                                        }
                                    })
                                }
                            </li>
                        )
                    })
                }
            </ol>
        </section>
    )
}