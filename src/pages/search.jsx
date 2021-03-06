import React from 'react';
import { 
    Button,
    Input,
    Row, 
    Col,
    Layout
} from 'antd';
import 'antd/dist/antd.css';

const { Header, Footer, Content } = Layout;

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadings: false,
            url1: '',
            url2: '',
            url3: '',
            searchText: ''
        }
    }
    
    resultsPage() {

        if (this.state.searchText == null || this.state.searchText == "" || (this.state.url1 == "" && this.state.url2 == "" && this.state.url3 == "")){
            alert("You need to input 3 URLs and a Text")
            return false
        } else {
            this.props.history.push({
                pathname: '/results',
                state: { 
                    url1: this.state.url1, 
                    url2: this.state.url2, 
                    url3: this.state.url3, 
                    searchText: this.state.searchText
                }
            });
        }

        
    };


    render (){
        return (
            <Layout>
                <Header id='1231' style={{ backgroundColor: '#f0f2f5'}}>
                    <img src={"hebbia_logo.png"} width="151px"/>
                </Header>
                
                <Content style={{ textAlign: 'center' }}>
                    <Row style={{ padding: 24, textAlign: 'center' }}>
                        <Col offset={7} span={10} style={{textAlign: 'center', justifyContent: 'center'}}>

                            <Input 
                                style={{marginBottom: '10px'}} 
                                onChange={e => this.setState({ url1: e.target.value})} 
                                placeholder="URL 1" 
                            />
                            
                            <Input 
                                style={{marginBottom: '10px'}} 
                                onChange={e => this.setState({ url2: e.target.value})} 
                                placeholder="URL 2" 
                            />

                            <Input 
                                style={{marginBottom: '10px'}} 
                                onChange={e => this.setState({ url3: e.target.value})} 
                                placeholder="URL 3" 
                            />

                            <Input 
                                style={{marginBottom: '10px'}} 
                                onChange={e => this.setState({ searchText: e.target.value})} 
                                placeholder="Text to be searched" 
                            />

                            <Button 
                                type="primary" 
                                loading={this.state.loadings} 
                                onClick={() => this.resultsPage()}
                                style={{borderColor: '#5ee4fe', backgroundColor: '#5ee4fe', color: 'rgb(48, 57, 66)'}}
                            >
                                Search!
                            </Button>  
                        
                        </Col>
                    </Row>
                </Content>
                <Footer>Footer</Footer>
            </Layout>
            
        )
    }
}
  
export default Search