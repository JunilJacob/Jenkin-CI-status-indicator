const St = imports.gi.St;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const Tweener = imports.ui.tweener;
const Soup = imports.gi.Soup;
const _httpSession = new Soup.SessionAsync();
Soup.Session.prototype.add_feature.call(_httpSession, new Soup.ProxyResolverDefault());


let greenIcon= new St.Icon({ icon_name: 'green',
                             style_class: 'system-status-icon' });
let redIcon= new St.Icon({ icon_name: 'red',
                         style_class: 'system-status-icon' });
let clockIcon= new St.Icon({ icon_name: 'clock',
                         style_class: 'system-status-icon' });
let blueIcon= new St.Icon({ icon_name: 'blue',
                         style_class: 'system-status-icon' });
let yellowIcon= new St.Icon({ icon_name: 'yellow',
                         style_class: 'system-status-icon' });
let greyIcon= new St.Icon({ icon_name: 'grey',
                         style_class: 'system-status-icon' });

let states = [
    { color: 'red_anime',     icon: 'yellowIcon'},
    { color: 'yellow_anime',  icon: 'clockIcon'},
    { color: 'blue_anime',    icon: 'clockIcon'},
    { color: 'grey_anime',    icon: 'clockIcon'},
    { color: 'aborted_anime', icon: 'clockIcon'},
    { color: 'red',           icon: 'redIcon'},
    { color: 'yellow',        icon: 'yellowIcon'},
    { color: 'blue',          icon: 'greenIcon'},
    { color: 'grey',          icon: 'greyIcon'},
    { color: 'aborted',       icon: 'greyIcon'},
    { color: 'disabled',      icon: 'greyIcon'},
  ];

let button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });


function init(extensionMeta) {
    let theme = imports.gi.Gtk.IconTheme.get_default();
    theme.append_search_path(extensionMeta.path + "/icons");
    
}

function httpGet(url) {
    var request = Soup.Message.new('GET', url);
    _httpSession.queue_message(request, function(_httpSession, message) {
        if (message.status_code !== 200) {
          callback(message.status_code, null);
          return ;
        }
        var icon = getIcon(request.response_body.data);
        setIcon(icon);
    });
}

function setIcon(icon) {
  switch(icon) {
    case 'greenIcon':
      button.set_child(greenIcon);
      break;
    case 'redIcon':
      button.set_child(redIcon);
      break;
    case 'blueIcon':
      button.set_child(blueIcon);
      break;
    case 'yellowIcon':
      button.set_child(yellowIcon);
      break;
    case 'clockIcon':
      button.set_child(clockIcon);
      break;
    case 'greyIcon':
      button.set_child(greyIcon);
      break
    default:
      button.set_child(yellowIcon);
  }
}

function getIcon(response) {
    var jobColor = JSON.parse(response).jobs[0].color;
    
    for( let i=0 ; i<states.length ; ++i )
    {
      if(states[i].color === jobColor){
        return states[i].icon;
      }
    }
    return 'greyIcon';
}

function getStatus() {
    httpGet("url"); // change url to something like http://<user>:<pass>@serveradress
    return true;
}
function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
    button.set_child(greyIcon);
    Mainloop.timeout_add(10000,getStatus)
}
function disable() {
    Main.panel._rightBox.remove_child(button);
}
