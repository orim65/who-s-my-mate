class Triple extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      subj: this.props.triple.subj,
      pred: this.props.triple.pred,
      obj: this.props.triple.obj,
    };
    this.toggleEditing = this.toggleEditing.bind(this);
    this.onSaveChanges = this.onSaveChanges.bind(this);
    this.onTripleDel = this.onTripleDel.bind(this);
    this.onCancelUpdate = this.onCancelUpdate.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
    
  toggleEditing () {
    this.setState(prevState => ({
      editing: !prevState.editing
    }));
  }

  onTripleDel() {
    this.props.onTripleDel(this.props.triple);
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }
  
  onSaveChanges () {
    this.props.onTripleUpdate(this.props.triple, this.state.subj, this.state.pred, this.state.obj);
    this.toggleEditing();
  }

  onCancelUpdate () {
    this.setState({
      subj: this.props.triple.subj,
      pred: this.props.triple.pred,
      obj: this.props.triple.obj
    });
    this.toggleEditing();
  }
  
  renderOrEdit(triple) {
    if (this.state.editing === true) { 
      return (
        <tr key={triple._id}>
          <td><input type="text" name="subj" value={this.state.subj} size="10" onChange={this.handleChange}/></td>
          <td><select name="pred" value={this.state.pred} onChange={this.handleChange}>
            <option value=" " disabled="disabled"></option>
            <option value="supports">supports</option>
            <option value="opposes">opposes</option>
          </select></td>
          <td><input type="text" name="obj" value={this.state.obj} size="10" onChange={this.handleChange}/></td>
          <td className="action"><button onClick={this.onSaveChanges}>Save</button><button onClick={this.onCancelUpdate}>Cancel</button></td>
        </tr>);
    } else {
      return (
        <tr key={triple._id}>
          <td>{triple.subj}</td>
          <td>{triple.pred}</td>
          <td>{triple.obj}</td>	    
          <td className="action"><button onClick={this.toggleEditing}>Edit</button><button onClick={this.onTripleDel}>Delete</button></td>
        </tr>);
    }
  }
      
  render () {
      return this.renderOrEdit(this.props.triple);
  }
}

class TripleTable extends React.Component {
  constructor(props) {
    super(props);        
  
    var temp = JSON.parse(localStorage.getItem("triples"));
    if (temp === null) {this.state = {triples: []}; } 
      else { this.state = {triples: temp}}
    this.handleTripleUpdate = this.handleTripleUpdate.bind(this);
    this.handleTripleAdd = this.handleTripleAdd.bind(this);
    this.handleTripleDel = this.handleTripleDel.bind(this);
    this.sendToMLServer = this.sendToMLServer.bind(this);
//    this.loadFromMLServer = this.loadFromMLServer.bind(this);
}

  sendToMLServer() {
    var data = JSON.stringify(this.state.triples);
    var instance = axios.create({
      headers: {'Content-Type': 'application/json'},
    });
    instance.post('http://localhost:3000/savetriples',data)
    .then(function(response){
        console.log('Triples saved successfully.')
    })
    .catch(function (error) {
      console.log(error);
      console.log(" while trying to create "+data);
    })
    .then(function() {
      instance.get('http://localhost:3000/topicform')
      .then (function(response) {
        document.getElementById("matesearch").innerHTML = response.data;
      })
    })
    .catch(function (error) {
      console.log(error);
      console.log(" while showing "+form);
    })
    ;
  }
/*
  loadFromMLServer() {
    axios.get('http://localhost:3000/ozpoltriplesjson')
    .then(function (response) {
      console.log(response);
      var mltriples = JSON.parse(response);
      var tmptriples = [];
      for (var subject in mltriples) {
        for (var predicate in mltriples[subject]) {
          for (var objectIndex in mltriples[subject][predicate]) {
            var object = mltriples[subject][predicate][objectIndex];
            // now what? 
            // 1. Add as new triples. Click x times and get x copies of each... not good.
            // 2. Overwrite the existing ones with whatever comes from the server. User would lose their work. Not good.
            // 3. Check each triple for existence before adding as a new triple. ...not one of the strengths of ReactJS.
            // ...why would the user want to load triples from the server anyway?
            
          }
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }
*/
  handleTripleAdd() {
    var id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
    var triple = {
      id: id,
      subj: "",
      pred: "",
      obj: ""
    };
    this.state.triples.push(triple);
    this.setState(this.state.triples);
    localStorage.setItem('triples',JSON.stringify(this.state.triples));
  }

  handleTripleDel(triple) {
    var index = this.state.triples.indexOf(triple);
    this.state.triples.splice(index,1);
    this.setState(this.state.triples);
    localStorage.setItem('triples',JSON.stringify(this.state.triples));
  }	
  
  handleTripleUpdate(triple, subj, pred, obj) {
    var index = this.state.triples.indexOf(triple);
    let tempTriples = this.state.triples;
    tempTriples[index].subj=subj;
    tempTriples[index].pred=pred;    
    tempTriples[index].obj=obj;
    this.setState({triples: tempTriples});
    localStorage.setItem('triples',JSON.stringify(this.state.triples));
  }
  
  render () {
    var rows = [];
    this.state.triples.forEach(function(triple) {
      rows.push(<Triple triple={triple} key={triple.id} onTripleDel={this.handleTripleDel} onTripleUpdate={this.handleTripleUpdate}/>);
    }.bind(this));
    return (
  <div>
    <h2>Observations</h2>
    <table>
      <thead>
        <tr>
          <th className="subj">Who (Subject)</th>
          <th className="pred">Stance (Predicate)</th>
          <th className="obj">Issue (Object)</th>
          <th className="action">Action</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
    <br/>
    <button onClick={this.handleTripleAdd}>Add a new observation</button>
    <button onClick={this.sendToMLServer}>Save on MarkLogic Server</button>          
    {/* <button onClick={this.loadFromMLServer}> Load from MarkLogic Server</button> */}
  </div>
  );
  }
}
  
ReactDOM.render(
  <TripleTable />,
  document.getElementById('triplesform')
);
