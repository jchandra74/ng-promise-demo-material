
(function() {
  'use strict';

  angular
    .module('myApp', []);

  angular
    .module('myApp')
    .factory('documentSvc', documentSvcFn);
  
  documentSvcFn.$inject = ['$log', '$http', '$q'];
  function documentSvcFn($log, $http, $q) {
    var svc = {
      getDocument: getDocument
    }
    return svc;
    
    function getDocument(docId) {
      return $http
        .get('/data/fakedocument  .json')
        .then(getDocumentSuccess)
        .catch(getDocumentFailure);
        
      function getDocumentSuccess(response) {
        return { docId: docId, subscriberId: 1, title: 'Foo' };
      }          
      
      function getDocumentFailure(response) {
        return $q.reject('Unable to load document ' + docId);
      }
    }
  }

  angular
    .module('myApp')
    .factory('subscriberSvc', subscriberSvcFn);
    
  subscriberSvcFn.$inject = ['$log', '$http', '$q'];
  function subscriberSvcFn($log, $http, $q) {
    var svc = {
      getSubscriber: getSubscriber
    }
    return svc;
    
    function getSubscriber(subscriberId) {
      return $http.get('/data/fakesubscriber.json')
        .then(getSubscriberSuccess)
        .catch(getSubscriberFailure);
        
        function getSubscriberSuccess() {
          return { name: 'Boo' };
        }
        
        function getSubscriberFailure(response) {
          return $q.reject('Unable to load subscriber ' + subscriberId);
        }
    }
  }
    
  angular
    .module('myApp')
    .controller('pageCtrl', pageCtrlFn);
      
  pageCtrlFn.$inject = ['$log', '$q', 'documentSvc', 'subscriberSvc'];
  function pageCtrlFn($log, $q, documentSvc, subscriberSvc) {
    var self = this;
    self.docId = null;
    self.currentDoc = null;
    self.progressText = "Please wait...";
    
    var tempDoc = {};
    
    activate();
    
    function activate() {
      self.docId = 1;
      self.currentDoc = null;
      tempDoc = {};
      
      getDocument(self.docId)
        .then(getDocumentSubscriber)
        .then(bindPage)
        .catch(activateFailure);
        
      function activateFailure(reason) {
        $log.error(reason);
      }
    }
    
    function getDocument(docId) {
      
      self.progressText = "Loading document " + docId + "...";
      
      return documentSvc
        .getDocument(docId)
        .then(getDocumentSuccess)
        .catch(getDocumentFailure);
        
      function getDocumentSuccess(doc) {
        tempDoc = doc;
        return doc.subscriberId;
      }
      
      function getDocumentFailure(reason) {
        self.progressText = reason;
        return $q.reject('Aborting...');
      }
    }

    function getDocumentSubscriber(subscriberId) {
      
      self.progressText = "Loading subscriber " + subscriberId + "...";
      
      return subscriberSvc
        .getSubscriber(subscriberId)
        .then(getSubscriberSuccess)
        .catch(getSubscriberFailure);

      function getSubscriberSuccess(subscriber) {
        tempDoc.subscriber = subscriber;
      }
      
      function getSubscriberFailure(reason) {
        self.progressText = reason;
        return $q.reject('Aborting...');
      }
    }

    function bindPage() {
      self.currentDoc = tempDoc;
    }
  }

  angular
    .bootstrap(document.body, ['myApp']);
}());