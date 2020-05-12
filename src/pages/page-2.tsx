// Gatsby supports TypeScript natively!
// @ts-ignore
import React, {Component} from "react"
import axios from "axios"

import Layout from "../components/layout"

import "../styles/score.scss"

const styles = {
    note: {
        marginLeft: '-40pt',
        marginRight: '-36pt'
    },
    accidental: {
        marginLeft: '-34pt',
        marginRight: '-62pt'
    },
    staff: {
        height: '21.25px',
        borderTop: '3px solid Black'
    },
    score: {
        fontSize: '15pt',
        marginLeft: '-10pt'
    },
}

const colors = {
    black: {
        color: '#000000',
    },
    amber: {
        color: '#ff6600',
    },
    red: {
        color: '#ff0000',
    }
}

class SecondPage extends Component {
    private staffCount: number;

    constructor() {
        super();
        this.state = {
            notes: [
            ]
        };
        this.staffCount = 0;
    }

    componentDidMount(): void {
        setInterval(() => {
            axios.get("http://localhost:10101/test").then((res)=>{
                this.setState({
                    ...this.state,
                    notes: [
                        ...this.state.notes,
                        ...res.data
                    ]
                })
            })
        }, 500)
    }

    render() {
        return (
            <Layout>
                <div className="score">
                    { this.createStaffs() }
                </div>
            </Layout>
        )
    }

    createStaffs() {
        const notes = this.state.notes.slice(0, this.state.notes.length)
        const staffs = []
        const notesPerStaff = 12;
        while (notes.length > 0) {
            staffs.push(notes.splice(0, notesPerStaff));
        }
        if (staffs.length > this.staffCount) {
            this.staffCount = staffs.length;
            window.scrollTo(0,document.body.scrollHeight);
        }
        return staffs.map(s => {
            return (
                <div className="staff" key={s[0].id}>
                    <div>
                        <i className="f-clef"></i>
                        {s.map(n => { return this.getNote(n) })}
                    </div>
                </div>
            )
        })
    }

    getNote(n) {
        const color = this.getColor(n.score)
        const message = color != colors.black ? n.frequency > n.pitch.frequency ? "高い" : "低い" : ""
        return (
            <i className={this.pitchToClassName(n.pitch)} style={color}>
                <span style={{fontSize: '10pt'}}>{message} {n.score}</span>
            </i>
        )
    }

    pitchToClassName(p) {
        return "quarter " + p.tone.toLowerCase().replace('_', '-') + "-" + p.scale
    }

    getColor(score) {
        if (score < 33) {
            return colors.red;
        } else if (score < 70) {
            return colors.amber;
        } else {
            return colors.black;
        }
    }
}

export default SecondPage
