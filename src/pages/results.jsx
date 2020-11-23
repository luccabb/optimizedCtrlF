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
        })
        this.setState({phrases})

        this.state.urls.forEach(url => {

            axios.get("https://fbsua3j128.execute-api.us-east-1.amazonaws.com/production/search", {
                params: {
                "url": url,
                "searchText": this.state.searchText
                }
            }).then((response) => {

                let items = {...this.state.phrases};
                let item = {...items[url]};
                item.load = false;
                item.title = response.data.title;
                item.matches = response.data.phrases;
                items[url] = item;
                this.setState({phrases: items});
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

                let items = {...this.state.phrases};
                let item = {...items[url]};
                item.load = false;
                item.title = response.data.title;
                item.matches = response.data.phrases;
                items[url] = item;
                this.setState({phrases: items});
                
            });
        })
    }


    render (){
        return (
            <Layout>
                <Header>Header</Header>
                <Content style={{ textAlign: 'center' }}>

                    <Row style={{ padding: 24, textAlign: 'center' }}>
                        <Col offset={4} span={16} style={{textAlign: 'center', justifyContent: 'center'}}>

                        <Input style={{marginBottom: '10px'}} onChange={e => this.setState({ newSearchText: e.target.value})} placeholder="Text to be searched" />

                        <Button type="primary" loading={this.state.loadings} onClick={() => this.searchForNewText()}>
                            Search again!
                        </Button>

                        </Col>
                    </Row>
                    

                    Results when searching for:<b> {this.state.searchText} </b>


                    <Row style={{ padding: 24, textAlign: 'center' }}>
                        <Col offset={4} span={16} style={{textAlign: 'center', justifyContent: 'center'}}>

                            {this.state.phrases && Object.keys(this.state.phrases).map((key) => (
                                
                                <Card style={{marginBottom: '10px'}} loading={this.state.phrases[key]["load"]}>
                                    <h2 style={{textAlign: 'left'}}>{this.state.phrases[key]["title"]}</h2>
                                    <a target="_blank" href={key} style={{textAlign: 'left', display: "block", marginBottom: '10px'}}>{key}</a>
                                    
                                    {this.state.phrases[key]["matches"].length != 0 ? this.state.phrases[key]["matches"].map(match =>
                                        <div dangerouslySetInnerHTML={{__html: match}}></div>
                                    ): 
                                    <p>No matching results were found.</p>
                                    }
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