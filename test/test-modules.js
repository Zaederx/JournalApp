
exports.isViewHidden = (viewId) => isViewHidden(viewId);


function isViewHidden(viewId) {
    var view = document.querySelector(viewId);
    var hidden = view.hasAttribute('hidden');
    return hidden;
  };