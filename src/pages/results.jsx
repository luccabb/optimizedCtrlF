import React from 'react';
import { 
    Button,
    Input,
    Row, 
    Col,
    Layout,
    Card,
} from 'antd';
import 'antd/dist/antd.css';
import axios from 'axios';
const { Header, Footer, Content } = Layout;


class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            urls: [this.props.location.state.url1, this.props.location.state.url2, this.props.location.state.url3],
            searchText: this.props.location.state.searchText,
            phrases: {},
            newSearchText: this.props.location.state.searchText,
        }
    }


    async componentDidMount(props){
        const phrases = {}
        this.state.urls.map(url=>{
            phrases[url] = {}
            phrases[url]["load"] = true
            phrases[url]["title"] = ''
            phrases[url]["matches"] = []
            phrases[url]["html"] = ''
            return phrases
        })
        this.setState({phrases})

        this.state.urls.forEach(url => {

            axios.get("https://fbsua3j128.execute-api.us-east-1.amazonaws.com/production/search", {
                params: {
                "url": url,
                "searchText": this.state.searchText
                }
            }).then((response) => {

                // update state based on get response
                let items = {...this.state.phrases};
                let item = {...items[url]};
                item.load = false;
                item.title = response.data.title;
                item.matches = response.data.phrases;
                item.html = response.data.html;
                items[url] = item;

                this.setState({phrases: items}, () => {

                    // scrolls within the iframe
                    var iframe = document.getElementById(response.data.title)
                    if (response.data.phrases.length !== 0) {
                        iframe.addEventListener("load", function() {
                            var scrollDiv = iframe.contentWindow.document.getElementById("highlight-0").offsetTop - 150;
                            iframe.contentWindow.scrollTo({ top: scrollDiv, behavior: 'smooth'});
                        });
                    }
                });

                
            });
        })
        
    }

    searchForNewText(){
        
        const phrases = {}
        this.state.urls.map(url=>{
            phrases[url] = {}
            phrases[url]["load"] = true
            phrases[url]["title"] = ''
            phrases[url]["matches"] = []
            phrases[url]["html"] = ''
            return phrases
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
                let items = {...this.state.phrases};
                let item = {...items[url]};
                item.load = false;
                item.title = response.data.title;
                item.matches = response.data.phrases;
                item.html = response.data.html;
                items[url] = item;

                this.setState({phrases: items}, ()=>{
                    // scrolls within the iframe
                    var iframe = document.getElementById(response.data.title)
                    if (response.data.phrases.length !== 0) {
                        iframe.addEventListener("load", function() {
                            var scrollDiv = iframe.contentWindow.document.getElementById("highlight-0").offsetTop - 150;
                            iframe.contentWindow.scrollTo({ top: scrollDiv, behavior: 'smooth'});
                        });
                    }
                    
                    
                });
                
            });
        })
    }

    scrollDown(title, index){

        // scrolls when user click in a specific match
        var iframe = document.getElementById(title)
        var scrollDiv = iframe.contentWindow.document.getElementById("highlight-" + index).offsetTop - 150;
        iframe.contentWindow.scrollTo({ top: scrollDiv, behavior: 'smooth'});

    }


    render (){
        return (
            <Layout>
                <Header id='1231'>Header</Header>
                <Content style={{ textAlign: 'center' }}>

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

                            {this.state.phrases && Object.keys(this.state.phrases).map((key, index) => (
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
                            ))}

                        </Col>
                    </Row>
                </Content>
                <Footer>Footer</Footer>
            </Layout>
            
        )
    }

}
  
export default Results