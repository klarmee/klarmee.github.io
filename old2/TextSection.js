import { Fragment } from "react"

export default function TextSection({ section }) {
  return (
    <section className={section.name}>
      {
        section.entries.map((entry, index) => {
          return (
            <Fragment key={index}>
              {
                Object.entries(entry).map(([key, values], index) => {
                  return (
                    <Fragment key={index}>
                      <h1>{key}</h1>
                      <ul>
                        {
                          values.map((value, index) => {
                            return (
                              <li key={index}>{value}</li>
                            )
                          })
                        }
                      </ul>
                    </Fragment>
                  )
                })
              }
            </Fragment>
          )
        })
      }
    </section>
  )
}