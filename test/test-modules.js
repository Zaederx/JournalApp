
exports.isViewHidden = (viewId) => isViewHidden(viewId);
exports.sleep = (ms) => sleep(ms);


function isViewHidden(viewId) {
    var view = document.querySelector(viewId);
    var hidden = view.hasAttribute('hidden');
    return hidden;
  };

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}