/**
 * Abstraction for a Asset.
 *  @class
 */
var Asset = Backbone.Model.extend({});

/**
 * Abstraction for a AssetView.
 *  @class
 */
var AssetView = Backbone.View.extend({
	template: _.template('<div class="item <%if (this.model.assetNumber %5 === 1) {%> active <%}%>"><img src="<%=url%>/fit/500x300" class="img-responsive"></div>'),
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
	}
});

/**
 * Abstraction for a Collection of Assets.
 *  @class
 */
var AssetList = Backbone.Collection.extend({

	perPage: 5,
	initialize: function() {
		this.url ="https://api.getchute.com/v2/albums/aus6kwrg/assets?tags=surfing&per_page=" + this.perPage;	
	},
	model:Asset,
	
	parse: function (response) {
		// Return data object which is the array from response
		this.page = response.pagination.current_page;
		this.nextPage = response.pagination.next_page;
		this.previousPage = response.pagination.previous_page;
		return response.data;
    } 
});

/**
 * Abstraction a View of Asset Collection.
 *  @class
 */

var AssetListView = Backbone.View.extend({
	assetCount:0,
	className: 'carousel-inner imagecontainer',	
	events: {
      "click .right.paginator"   : "nextClicked",
	  "click .left.paginator"   : "previousClicked"
	},
	nextClicked: function() {	
		this.collection.url = this.collection.nextPage;
		this.collection.fetch();	

	},
	previousClicked: function() {	
		this.collection.url = this.collection.previousPage;	
		this.collection.fetch();	
	},
	
	initialize: function() {
		this.collection.on('add', this.addAsset, this);
		this.collection.on('reset', this.addAllAsset, this);
		this.collection.on('sync', this.addAllAsset, this);				
	},
	addAsset: function(asset) {
		this.assetCount++;
		asset.assetNumber = this.assetCount; 
		var assetView = new AssetView({model:asset});
		assetView.render();		
		if((this.assetCount -1) % this.collection.perPage === 0) {
			this.$el.empty();
		}	
		this.$el.append(assetView.$el.html());
		if(this.assetCount % this.collection.perPage === 0) {
			$('#theCarousel').carousel({
				interval: 4000
			});			
			if (this.collection.nextPage) {
				this.$el.append('<a class="carousel-control right paginator carousel-border" role="button" href="#theCarousel">' +
				'<span aria-hidden="true" class="glyphicon glyphicon-chevron-right"></span>' +
				'<span class="sr-only">Next</span></a>');
			}	
			if (this.collection.previousPage ) {
				this.$el.append('<a class="carousel-control left paginator carousel-border" role="button" href="#theCarousel">' +
				'<span aria-hidden="true" class="glyphicon glyphicon-chevron-left"></span>' +
				'<span class="sr-only">Previous</span></a>');
			}						
		}
	},
	render: function() {
		this.addAllAssets();
	},
	addAllAssets: function() {
		this.collection.forEach(this.addAsset, this);
	}
	
});


$(function(){
var AssetRouter = new (Backbone.Router.extend({ 
	routes: {"": 'index', 'assets/:id': 'show',
			"/page":"page"},
	initialize: function() {
		this.assets = new AssetList();	
		this.assetListView = new AssetListView({
			collection: this.assets
		});	

		this.assets.fetch();
		$('#theCarousel').html(this.assetListView.$el);
	
		//this.assets.getNextPage();			
		/*setTimeout(function(){
			$('.slider-wrapper').show();
			$('.slider').leanSlider({
			directionNav: '#slider-direction-nav',
			controlNav: '#slider-control-nav',
			afterChange: function(slide) {
				console.log("Slide is");
				console.log(slide);
			}
			
		})}, 10000);*/
	},
	
	index: function() {			
		this.assets.fetch();
		$('.slider-wrapper').html(this.assetListView.$el);
	},
	show: function(id){
	},
	
	start: function() {
		Backbone.history.start({
			pushState: true});
	}	
 }));
    //Lauch the AssetRouter
	AssetRouter.start();
	
});
