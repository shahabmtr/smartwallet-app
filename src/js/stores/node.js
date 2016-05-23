import Reflux from 'reflux'
import nodeActions from 'actions/node'
import GraphAgent from 'lib/agents/graph.js'
import rdf from 'rdflib'
let FOAF = rdf.Namespace('http://xmlns.com/foaf/0.1/')
let SCHEMA = rdf.Namespace('https://schema.org/')

export default Reflux.createStore({
  listenables: nodeActions,

  init() {
    this.gAgent = new GraphAgent()
  },

  getInitialState() {
    return null
  },

  create(user, node, title, description, image, type) {
    this.gAgent.createNode(user, node, title, description, image, type)
  },

  onCreateCompleted(node) {
    this.trigger(node)
  },

  link(webId, start, end, type) {
    this.gAgent.writeAccess(webId, end).then((verdict) => {
      let predicate = null
      if(type == 'generic') predicate = SCHEMA('isRelatedTo')
      if(type =='knows') predicate = FOAF('knows')
      if(verdict)
        // Needs some error handling perhaps.
        this.gAgent.writeTriple(end, predicate, rdf.sym(start))
    })
  }
})
