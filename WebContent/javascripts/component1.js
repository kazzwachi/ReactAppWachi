class Component1 extends React.Component{
	render(){
		return React.createElement('div',{class : 'greeting'},this.props.message);
	}
}