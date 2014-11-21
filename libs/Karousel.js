(function(global) {
    var utils = global.utils;
    var karousel = global.karousel = {};

    // Slide
    var Slide = function(src, size) {
        var self = this;
        self.image = new Image();
        self.init(src, size);
    };

    utils.extend(Slide.prototype, [{
        move: function(diff) {
            var self = this;
            self.setX(self.image.offsetLeft + diff);
        },

        setX: function(x) {
            var self = this;
            self.image.style.left = x + 'px';
        },

        init: function(src, size) {
            var self = this,
                image = self.image;

            image.style.position = 'absolute';
            image.src = src;
            self.setSize(size);
        },

        setSize: function(size) {
            var self = this,
                image = self.image;

            image.width = size.width;
            image.height = size.height;
        }
    }]);

    // Karousel
    var Karousel = global.Karousel = function(container, srcs, options) {
        var self = this;
        self.options = utils.extend({}, [self.defaultOptions, options || {}]);
        self.slides = [];
        self.container = container;
        self.init(srcs);
    };

    utils.extend(Karousel.prototype, [{
        defaultOptions: {
            itemsSize: {
                width: 300,
                height: 100
            },
            animationDuration: 500,
            animationInterval: 60
        },

        init: function(srcs) {
            var self = this,
                container = self.container,
                options = self.options;

            container.style.position = 'relative';
            container.style.height = options.itemsSize.height + 'px';
            srcs.forEach(self.appendSlide.bind(self));
        },

        moveSlides: function(diff) {
            var self = this;
            self.slides.forEach(function(slide) {
                slide.move(diff);
            });
        },

        appendSlide: function(src) {
            var self = this;
            slides = self.slides,
                newSlide = new Slide(src, self.options.itemsSize),
                lastSlide = slides[slides.length - 1];

            slides.push(newSlide);
            newSlide.setX(lastSlide ? lastSlide.image.offsetLeft + lastSlide.image.width : 0);
            self.container.appendChild(newSlide.image);
            return newSlide;
        },

        prependSlide: function(src) {
            var self = this,
                slides = self.slides,
                newSlide = new Slide(src, self.options.itemsSize),
                firstSlide = slides[0];

            slides.splice(0, 0, newSlide);
            newSlide.setX(firstSlide ? firstSlide.image.offsetLeft - firstSlide.image.width : 0);
            self.container.appendChild(newSlide.image);
            return newSlide;
        },

        removeSlide: function(slide) {
            var self = this;
            self.slides.splice(self.slides.indexOf(slide), 1);
            self.container.removeChild(slide.image);
        },

        next: function() {
            var self = this;
            self.navigate(-1);
        },

        previous: function() {
            var self = this;
            self.navigate(1);
        },

        navigate: function(direction) {
            var self = this,
                options = self.options,
                slides = self.slides,
                lastSlide,
                newSlide;

            if (direction < 0) {
                lastSlide = slides[0];
                newSlide = self.appendSlide(lastSlide.image.src);
            } else {
                lastSlide = slides[slides.length - 1];
                newSlide = self.prependSlide(lastSlide.image.src)
            }

            var moveDest = options.itemsSize.width * direction;
            var movePerInterval = moveDest / options.animationDuration * options.animationInterval;
            var movedDistance = 0;


            (function recursive() {
                if (movedDistance + movePerInterval * direction < moveDest * direction) {
                    self.moveSlides(movePerInterval);
                    movedDistance += movePerInterval * direction;
                    setTimeout(recursive, options.animationInterval);
                } else if (movedDistance + movePerInterval * direction === moveDest * direction) {
                    self.moveSlides(movePerInterval);
                    self.removeSlide(lastSlide);
                } else {
                    self.moveSlides(moveDest - movedDistance * direction);
                    self.removeSlide(lastSlide);
                }
            })();
        }
    }]);

})(ns);