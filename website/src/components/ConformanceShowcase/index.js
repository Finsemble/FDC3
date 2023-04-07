import community from "../../../data/community.json";
const React = require('react');
import styles from './styles.module.css'

export default ({ badge }) => {

    const relevant = community.flatMap(c => {
        return (c.conformance ?? [])
            .filter(i => i.src == badge)
            .map(i => {
                return {
                    "conf": c,
                    "badge": i
                }
            });
    });

    return <div className={styles.conformanceShowcase}>
        {
            relevant.map((c, i) => {
                return (
                    <div className={styles.conformanceShowcaseItem} key={`showcase-${i}`}>
                        <div className={styles.conformanceImage}>
                            <img src={c.conf.image} alt={c.conf.title} title={c.conf.title} />
                        </div>
                        <div className={styles.conformanceText}>
                            <a href={c.conf.infoLink}><h3>{c.conf.title}</h3></a><ul>
                                {
                                    c.badge.items.map((item, j) => {
                                        return (<li className={styles.conformanceItem} key={`badge-${i}-${j}`}>
                                            <p>{item.text} {  (item.link) ? <em><a href={item.link}>More Details</a></em> :"" }</p>
                                        </li>)
                                    })
                                }
                            </ul>

                        </div>
                    </div>)
            })
        }

    </div>
}