import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';

// BOOTSTRAP COMPONENTS
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card'

// ANTD COMPONENTS
import { Form, Input, Icon, Button, Select } from 'antd';

// XE LOGO
import Logo from '../assets/xe.png';

// CREATE OBJECTS TO CORRESPOND ENGLISH TO GREEK CHARS AND VICE-VERSA TO IMPLEMENT SPELLING CHECK ON THE USER'S INPUT
const enToEl = {
    "q": '',
    'w': 'ς',
    'e': 'ε',
    'r': 'ρ',
    't': 'τ',
    'y': 'υ',
    'u': 'θ',
    'i': 'ι',
    'o': 'ο',
    'p': 'π',
    'a': 'α',
    's': 'σ',
    'd': 'δ',
    'f': 'φ',
    'g': 'γ',
    'h': 'η',
    'j': 'ξ',
    'k': 'κ',
    'l': 'λ',
    'z': 'ζ',
    'x': 'χ',
    'c': 'ψ',
    'v': 'ω',
    'b': 'β',
    'n': 'ν',
    'm': 'μ'
}

const elToEn = {
    ';': 'q',
    'ς': 'w',
    'ε': 'e',
    'ρ': 'r',
    'τ': 't',
    'υ': 'y',
    'θ': 'u',
    'ι': 'i',
    'ο': 'o',
    'π': 'p',
    'α': 'a',
    'σ': 's',
    'δ': 'd',
    'φ': 'f',
    'γ': 'g',
    'η': 'h',
    'ξ': 'j',
    'κ': 'k',
    'λ': 'l',
    'ζ': 'z',
    'χ': 'x',
    'ψ': 'c',
    'ω': 'v',
    'β': 'b',
    'ν': 'n',
    'μ': 'm'
}
  
class Autocomplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInput: '',
            results: [],
            showSuggestions: false,
            searchButtonDisabled: true,
            inputLanguage: 'en'
        }
        // USE LODASH DEBOUNCE TO AVOID USELESS MULTIPLE CALLS TO THE API IN EVERY KEYSTROKE
        this.getDataEn = _.debounce(this.getDataEn, 500);
        this.getDataEl = _.debounce(this.getDataEl, 500);
    }

    // RETRIEVE DATA USING THE ENGLISH VERSION OF THE DB
    getDataEn = () => {

        // CREATE AND IMPLEMENT SPELLING RULE FOR THE USER'S INPUT
        let spellingRule = /[ςερτυθιοπασδφγηξκλζχψωβνμ]/;
        // IF USER'S INPUT IS NOT ENGLISH/LATIN CONVERT IT AND THEN RETRIEVE THE DATA FROM THE DB
        if (spellingRule.test(this.state.userInput)) {
            let userInputConverted;
            userInputConverted = this.state.userInput.replace(/[ςερτυθιοπασδφγηξκλζχψωβνμ]/g, function(match){
                return elToEn[match]
            })
            console.log(userInputConverted)
            
            if (userInputConverted.length > 1) {
                this.setState(
                    {userInput: userInputConverted}, 
                    () => {
                        axios.get(`http://35.180.182.8/search?keywords=${this.state.userInput}&language=en&limit=20`)
                        .then(response => {            
                            this.setState({ 
                            results: response.data.entries
                            })
                            console.log(response)
                        })
                        .catch((error) => { console.log(error.response.data) });
                    }
                )    
            } else {console.log('No keyword')}    
        // IF USER'S INPUT IS EN/LATIN JUST THEN RETRIEVE THE DATA FROM THE DB 
        } else {
            if (this.state.userInput.length > 1) {
                axios.get(`http://35.180.182.8/search?keywords=${this.state.userInput}&language=en&limit=20`)
                .then(response => {            
                    this.setState({ 
                    results: response.data.entries
                    })
                    console.log(response)
                })
                .catch((error) => { console.log(error.response.data) });
            } else {console.log('No keyword')}
        }
    }

    // RETRIEVE DATA USING THE GREEK VERSION OF THE DB
    getDataEl = () => {

        // CREATE AND IMPLEMENT SPELLING RULE FOR THE USER'S INPUT
        let spellingRule = /[qwertyuiopasdfghjklzxcvbnm]/;
        // IF USER'S INPUT IS NOT GREEK CONVERT IT AND THEN RETRIEVE THE DATA FROM THE DB
        if (spellingRule.test(this.state.userInput)) {
            let userInputConverted;
            userInputConverted = this.state.userInput.replace(/[qwertyuiopasdfghjklzxcvbnm]/g, function(match){
                return enToEl[match]
            })
            console.log(userInputConverted)
            
            if (userInputConverted.length > 1) {
                this.setState(
                    {userInput: userInputConverted}, 
                    () => {
                        axios.get(`http://35.180.182.8/search?keywords=${this.state.userInput}&language=el&limit=20`)
                        .then(response => {            
                            this.setState({ 
                            results: response.data.entries
                            })
                            console.log(response)
                        })
                        .catch((error) => { console.log(error) });        
                    }
                )    
            } else {console.log("No keyword")}    
        // IF USER'S INPUT IS GREEK JUST THEN RETRIEVE THE DATA FROM THE DB 
        } else {
            if (this.state.userInput.length > 1) {
                axios.get(`http://35.180.182.8/search?keywords=${this.state.userInput}&language=el&limit=20`)
                .then(response => {            
                    this.setState({ 
                    results: response.data.entries
                    })
                    console.log(response)
                })
                .catch((error) => { console.log(error) });        
            } else {console.log("No keyword")}    
        }
    }

    handleChange = (e) => {

        console.log(e.target.value)

        // HANDLE USER'S INPUT FOR SELECTED LANGUAGE = ENGLISH/LATIN
        if (this.state.inputLanguage === 'en') {
            this.setState(
                { userInput: e.target.value, searchButtonDisabled: true }, 
                () => {
                    if (this.state.userInput && this.state.userInput.length > 1) {
                        this.getDataEn();
                        this.setState({
                            showSuggestions: true
                        })
                    } else if (!this.state.userInput) {
                        this.setState({
                            showSuggestions: false,
                            results: []
                        })
                    }
                }
            )        
        } 

        // HANDLE USER'S INPUT FOR SELECTED LANGUAGE = GREEK
        if (this.state.inputLanguage === 'el') {
            this.setState(
                { userInput: e.target.value, searchButtonDisabled: true }, 
                () => {
                    if (this.state.userInput && this.state.userInput.length > 1) {
                        this.getDataEl();
                        this.setState({
                            showSuggestions: true
                        })
                    } else if (!this.state.userInput) {
                        this.setState({
                            showSuggestions: false,
                            results: []
                        })
                    }
                }
            )    
        }
    }

    // ON SELECT FROM THE SUGGESTIONS COPY TEXT TO THE SEARCH BAR AND RESET RESULTS
    onSelect = (e) => {
        this.setState({
            userInput: e.currentTarget.innerText,
            showSuggestions: false,
            searchButtonDisabled: false,
            results: []
        })
    }

    // REDIRECT USER ON GOOGLE TO SEARCH FOR THE SELECTED RESULT
    googleSearch = () => {
        console.log(this.state.userInput)
        window.open(`https://www.google.com/search?q=${this.state.userInput}`)
    }

    // SELECT LANGUAGE
    setLanguage = (value) => {
        this.setState({
            inputLanguage: value
        })
        console.log(value)
    }

    render() {
        // CREATE A NEW ARRAY TO DISPLAY UP TO 10 SUGGESTIONS IN THE XSMALL-SMALL VIEWS
        const mobileSuggestions = this.state.results.slice(0, 10)
        return (
            <div>
                <div style={{padding: '1.5%'}}>
                    <Container>
                        <Row>
                            <Col md={4} lg={4} xl={4} />
                            <Col md={6} lg={6} xl={6}>
                                <div style={{textAlign: 'right'}}>
                                    <Select style={{ width: '70px' }}
                                        defaultValue='en' 
                                        onChange={this.setLanguage}
                                    >
                                        <Select.Option value="en">EN</Select.Option>
                                        <Select.Option value="el">GR</Select.Option>
                                    </Select>
                                </div>
                            </Col>
                            <Col md={2} lg={2} xl={2} />
                        </Row>
                        <Row>
                            <Col lg={2} xl={2} className='d-none d-lg-block d-xl-block'>
                                <div style={{
                                    borderStyle: 'dotted',
                                    height: '60vh', 
                                }}>
                                    Banner space
                                </div>
                            </Col>
                            <Col md={12} lg={2} xl={2}>
                                <div style={{textAlign: 'center'}}>
                                    <img src={Logo} style={{width: '100px'}} alt='logo'/>
                                </div>
                            </Col>
                            <Col md={2} className='d-none d-md-block d-lg-none' />
                            <Col md={8} lg={6} xl={6}>
                                <Form>
                                    <Form.Item >
                                        {this.state.inputLanguage === 'en' &&
                                            <span>What place are you looking for?</span>
                                        }
                                        {this.state.inputLanguage === 'el' &&
                                            <span>Τι ψάχνεις;</span>
                                        }
                                            <Input
                                                placeholder=""
                                                onChange={this.handleChange}
                                                style={{ width: '100%' }}
                                                allowClear={true}
                                                value={this.state.userInput}
                                                prefix={<Icon type="search"/>}
                                                suffix={<Icon type="audio"/>}
                                            />
                                    </Form.Item>
                                </Form>
                                {this.state.userInput.length > 1 && this.state.showSuggestions ?
                                // DISPLAY UP TO 20 RESULTS FOR MEDIUM TO XLARGE DEVICES //
                                    <Card className='d-none d-sm-none d-md-block d-lg-block d-xl-block'
                                    style={{marginTop: '-25px', height: '220px', overflow: 'auto'}}>
                                        {this.state.results.map((result, index) => {
                                            return(
                                                <div key={index}>
                                                    <ListGroup variant="flush">
                                                        <ListGroup.Item action variant="light"
                                                        onClick={this.onSelect}
                                                        >
                                                            {result.name.substring(0, 60)}{'...'}
                                                        </ListGroup.Item>
                                                    </ListGroup>
                                                </div>
                                            )
                                        })}
                                    </Card>
                                : 
                                <div className='d-none d-sm-none d-md-block d-lg-block d-xl-block'
                                style={{marginTop: '-25px', height: '220px'}}></div>
                                }
                                {this.state.userInput.length > 1 && this.state.showSuggestions ?
                                // DISPLAY UP TO 10 RESULTS FOR X-SMALL TO SMALL DEVICES //
                                    <Card className='d-md-none d-lg-none d-xl-none'
                                    style={{marginTop: '-25px', height: '220px', overflow: 'auto'}}>
                                        {mobileSuggestions.map((data, index) => {
                                            return(
                                                <div key={index}>
                                                    <ListGroup variant="flush">
                                                        <ListGroup.Item action variant="light"
                                                        onClick={this.onSelect}
                                                        >
                                                            {data.name.substring(0, 40)}{'...'}
                                                        </ListGroup.Item>
                                                    </ListGroup>
                                                </div>
                                            )
                                        })}
                                    </Card>
                                : 
                                <div className='d-md-none d-lg-none d-xl-none'
                                style={{marginTop: '-25px', height: '220px'}}></div>
                                }
                            </Col>
                            <Col md={2} className='d-none d-md-block d-lg-none' />
                            <Col lg={2} xl={2} className='d-none d-lg-block d-xl-block'/>
                        </Row>
                        <Row style={{marginTop: '15px'}}>
                            <Col lg={2} xl={2} className='d-none d-lg-block d-xl-block'/>
                            <Col md={2} lg={2} xl={2}/>
                            {/* BUTTON POSITION FOR LARGE TO XLARGE DEVICES */}
                            <Col lg={6} xl={6} className='d-none d-lg-block d-xl-block'>
                                <Button disabled={this.state.searchButtonDisabled} icon="search" onClick={this.googleSearch}>
                                    Click to search
                                </Button>
                            </Col>
                            {/* BUTTON POSITION FOR XSMALL TO MEDIUM DEVICES */}
                            <Col md={8} className='d-lg-none d-xl-none' style={{textAlign: 'center'}}>
                                <Button disabled={this.state.searchButtonDisabled} icon="search" onClick={this.googleSearch}>
                                    Click to search
                                </Button>
                            </Col>
                            <Col md={2} lg={2} xl={2}/>
                        </Row>
                        <Row style={{marginTop: '15px'}} className='d-none d-md-block d-lg-none'>
                            <Col md={12}>
                                <div style={{borderStyle: 'dotted', height: '20vh'}}>
                                    Banner space
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        )
    }
}

export default Autocomplete;