import React from 'react';
import { 
    Button,
    Input,
    Row, 
    Col,
    Layout,
    Card,
    Tabs,
    Breadcrumb,
    Radio
} from 'antd';
import 'antd/dist/antd.css';
import axios from 'axios';
const { TabPane } = Tabs;
const { Header, Footer, Content } = Layout;


class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            urls: [this.props.location.state.url1, this.props.location.state.url2, this.props.location.state.url3],
            searchText: this.props.location.state.searchText,
            phrases: {},
            newSearchText: "",
            viewType: "Card",
            optionsRadio: [{label: 'Single Page View', value: 'View'}, {label: 'Tab View', value: 'TabView'}],
            valueRadio: 'View',
            userPosition: {} 

        }
    }

    scrollToFirstMatch(iframe, response){
        if (response.data.phrases.length !== 0) {
            iframe.addEventListener("load", function() {
                for(var h = 0; h < response.data.phrases.length; h++) {
                    if (iframe.contentWindow.document.getElementById("highlight-"+h) !== null){
                        var scrollDiv = iframe.contentWindow.document.getElementById("highlight-"+h).offsetTop - 150;
                        iframe.contentWindow.scrollTo({ top: scrollDiv, behavior: 'smooth'});
                        break;
                    }
                }
            });
        }
    }

    startUrl(phrases, url){
        phrases[url] = {}
        phrases[url]["load"] = true
        phrases[url]["title"] = ''
        phrases[url]["matches"] = []
        phrases[url]["html"] = ''
        phrases[url]["max"] = 0
        return phrases
    }

    updateUrl(response, url){
        let items = {...this.state.phrases};
        let item = {...items[url]};
        item.load = false;
        item.title = response.data.title;
        item.matches = response.data.phrases;
        item.html = response.data.html;
        item.max = response.data.max;
        items[url] = item;
        return items
    }

    componentDidMount(props){
        const phrases = {}
        const userPosition = {}
        this.state.urls.map(url=>{
            userPosition[url] = 0
            return this.startUrl(phrases, url)
        })
        this.setState({phrases, userPosition})


        this.state.urls.forEach(url => {

            axios.get("https://fbsua3j128.execute-api.us-east-1.amazonaws.com/production/search", {
                params: {
                "url": url,
                "searchText": this.state.searchText
                }
            }).then((response) => {

                var items = this.updateUrl(response, url)

                this.setState({phrases: items}, () => {

                    // scrolls within the iframe
                    var iframe = document.getElementById(response.data.title)
                    this.scrollToFirstMatch(iframe, response)

                });

                
            });
        })
        
    }

    searchForNewText(){

        if (this.state.newSearchText == null || this.state.newSearchText == ""){
            alert("Search text can't be null")
            return false
        } else {

            const phrases = {}
            this.state.urls.map(url=>{
                return this.startUrl(phrases, url)
            })
            this.setState({phrases})
            this.setState({searchText: this.state.newSearchText})

            this.state.urls.forEach(url => {

                axios.get("https://fbsua3j128.execute-api.us-east-1.amazonaws.com/production/search", {
                    params: {
                    "url": url,
                    "searchText": this.state.newSearchText
                    }
                }).then((response) => {

                    // update state based on get 
                    var itemsUpdate = this.updateUrl(response, url)

                    this.setState({phrases: itemsUpdate}, ()=>{
                        // scrolls within the iframe
                        var iframe = document.getElementById(response.data.title)
                        this.scrollToFirstMatch(iframe, response)
                        
                    });
                    
                });
            })

        }
        
        
    }

    scrollDown(title, index){
        // scrolls when user click in a specific match
        var iframe = document.getElementById(title)
        if (iframe.contentWindow.document.getElementById("highlight-"+index) !== null){
            var scrollDiv = iframe.contentWindow.document.getElementById("highlight-"+index).offsetTop - 150;
            iframe.contentWindow.scrollTo({ top: scrollDiv, behavior: 'smooth'});
        }
    }

    changeView = e => {
        this.setState({valueRadio: e.target.value})
    }

    prevMatch(url) {
        if (this.state.userPosition[url] == 0) {
            return 0
        } else {
            let items = {...this.state.userPosition};
            items[url] = this.state.userPosition[url] - 1
            this.setState({userPosition: items})
        }
        
    }

    nextMatch(url) {
        if (this.state.phrases[url].max == this.state.userPosition[url]) {
            return 0
        } else {
            let items = {...this.state.userPosition};
            items[url] = this.state.userPosition[url] + 1
            this.setState({userPosition: items})
        }
    }


    render (){
        return (
            <Layout>
                <Header id='1231' style={{ backgroundColor: '#f0f2f5'}}>
                    <img src={"hebbia_logo.png"} width="151px"/>
                </Header>

                
                <Content style={{ textAlign: 'center', backgroundColor: '#f0f2f5' }}>

                    <Row style={{ padding: 24}}>
                        <Breadcrumb style={{ textAlign: 'left' }}>
                            <Breadcrumb.Item><a href="/">Home</a></Breadcrumb.Item>
                            <Breadcrumb.Item>Results</Breadcrumb.Item>
                        </Breadcrumb>

                        <Radio.Group
                            options={this.state.optionsRadio}
                            style={{ textAlign: 'center', width: '100%' }}
                            onChange={this.changeView}
                            value={this.state.valueRadio}
                            optionType="button"
                        />


                    </Row>
                    
                    <Row style={{ padding: 24, textAlign: 'center' }}>

                        <Col offset={4} span={16} style={{textAlign: 'center', justifyContent: 'center'}}>

                            <Input 
                                style={{marginBottom: '10px'}} 
                                onChange={e => this.setState({ newSearchText: e.target.value})} 
                                placeholder="Text to be searched" 
                            />

                            <Button 
                                type="primary" 
                                loading={this.state.loadings} 
                                onClick={() => this.searchForNewText()}
                                style={{borderColor: '#5ee4fe', backgroundColor: '#5ee4fe', color: 'rgb(48, 57, 66)'}}
                            >
                                Search again!
                            </Button>      

                        </Col>
                    </Row>
                    
                    Results when searching for:<b> {this.state.searchText} </b>

                    <Row style={{ padding: 24, textAlign: 'center'}}>
                        <Col offset={4} span={16} style={{textAlign: 'center', justifyContent: 'center'}}>

                        {
                            this.state.valueRadio == 'TabView' ? 
                            <Tabs defaultActiveKey="1" style={{backgroundColor: '#fff'}}>
                                {this.state.phrases && Object.keys(this.state.phrases).map((key, index) => (
                                        // building cards
                                        <TabPane key={index} tab={this.state.phrases[key]["title"]} style={{marginBottom: '10px', margin: '10px'}}>
                                            <h2 style={{textAlign: 'left'}}>{this.state.phrases[key]["title"]}</h2>
                                            <a href={key} target="_blank" rel="noreferrer" style={{textAlign: 'left', display: "block", marginBottom: '10px'}}>{key}</a>

                                            <div style={{marginBottom: '20px'}}>
                                                <b>Matches</b>
                                                {this.state.phrases[key]["matches"].length !== 0 ? this.state.phrases[key]["matches"].map((match, index) => 
                                                    <a 
                                                        key={index} 
                                                        onClick={e => (this.scrollDown(this.state.phrases[key]["title"], index))}
                                                        style={{   
                                                            color: '#5ee4fe',
                                                            textDecoration: 'underline'
                                                        }}
                                                    >
                                                        <div
                                                            dangerouslySetInnerHTML={{__html: match}} 
                                                        />
                                                    </a>
                                                ): 
                                                <p>No matching results were found.</p>
                                                }
                                            </div>

                                            <div style={{marginBottom: '20px'}}>
                                                <Button 
                                                    type="primary" 
                                                    shape="circle" 
                                                    onClick={() => (this.prevMatch(key), this.scrollDown(this.state.phrases[key]["title"], this.state.userPosition[key] -1))}
                                                >
                                                    ↑
                                                </Button>
                                                <Button 
                                                    type="primary" 
                                                    shape="circle"
                                                    onClick={() => (this.nextMatch(key), this.scrollDown(this.state.phrases[key]["title"], this.state.userPosition[key] +1))}
                                                >
                                                    ↓
                                                </Button>
                                            </div>
                                            
                                            {/* loading iframe */}
                                            <iframe 
                                                id={this.state.phrases[key]["title"]} 
                                                title={this.state.phrases[key]["title"]} 
                                                srcDoc={this.state.phrases[key]["html"]} 
                                                height="400px" 
                                                width="90%" 
                                                sandbox="allow-same-origin allow-scripts"
                                            />
                                            
                                        </TabPane>
                                    ))}
                            </Tabs> :

                            this.state.phrases && Object.keys(this.state.phrases).map((key, index) => (
                                // building cards
                                <Card key={index} style={{marginBottom: '10px'}} loading={this.state.phrases[key]["load"]}>
                                    <h2 style={{textAlign: 'left'}}>{this.state.phrases[key]["title"]}</h2>
                                    <a href={key} target="_blank" rel="noreferrer" style={{textAlign: 'left', display: "block", marginBottom: '10px'}}>{key}</a>

                                    <div style={{marginBottom: '20px'}}>
                                        <b>Matches</b>
                                        {this.state.phrases[key]["matches"].length !== 0 ? this.state.phrases[key]["matches"].map((match, index) => 
                                            <a 
                                                key={index} 
                                                onClick={e => (this.scrollDown(this.state.phrases[key]["title"], index))}
                                                style={{   
                                                    color: '#5ee4fe',
                                                    textDecoration: 'underline'
                                                }}
                                            >
                                                <div
                                                    dangerouslySetInnerHTML={{__html: match}} 
                                                />
                                            </a>
                                        ): 
                                        <p>No matching results were found.</p>
                                        }
                                    </div>
                                    <div style={{marginBottom: '20px'}}>
                                        <Button 
                                            type="primary" 
                                            shape="circle" 
                                            onClick={() => (this.prevMatch(key), this.scrollDown(this.state.phrases[key]["title"], this.state.userPosition[key] -1))}
                                        >
                                            ↑
                                        </Button>
                                        <Button 
                                            type="primary" 
                                            shape="circle"
                                            onClick={() => (this.nextMatch(key), this.scrollDown(this.state.phrases[key]["title"], this.state.userPosition[key] +1))}
                                        >
                                            ↓
                                        </Button>
                                    </div>

                                    {/* loading iframe */}
                                    <iframe 
                                        id={this.state.phrases[key]["title"]} 
                                        title={this.state.phrases[key]["title"]} 
                                        srcDoc={this.state.phrases[key]["html"]} 
                                        height="400px" 
                                        width="90%" 
                                        sandbox="allow-same-origin allow-scripts"
                                    />
                                    
                                </Card>
                            ))

                        }

                        </Col>
                    </Row>
                </Content>
                <Footer>Footer</Footer>
            </Layout>
            
        )
    }

}
  
export default Results