// ==UserScript==
// @name         bilibili-syncer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description
// @author       boddmg
// @match        http://www.bilibili.com/video/av*/
// @grant        none
// @require      https://cdn.wilddog.com/js/client/current/wilddog.js
// ==/UserScript==

// 'use strict';
window.onload = function() {
	window.server = false;
    var playing = false;

    console.log("here");

    getWilddog = function() {
        var ref = new Wilddog("https://bilisyncer.wilddogio.com/synccode/code1/user1");
        return ref;
    };

    console.log("defined get wd");

    getController = function(callback) {
        var v = document.getElementById("bilibili_helper_html5_player_video");
        if (v !== null) {
            callback(v);
        } else {
            console.log("retry.");
            setTimeout(function() {
                getController(callback);
            }, 1000);
        }
    };

    getController(function(video) {
        getWilddog().once("value", function(snapshot, error) {
            var current_process = snapshot.val();
            console.log(current_process);
            video.currentTime = current_process;
        });

        var update_process = function() {
            getController(function(video) {
                var current_process = video.currentTime;
                if (playing && window.server) {
                    getWilddog().set(current_process);
                }
            });
            setTimeout(update_process, 1000);
        };
        update_process();

        video.onplay = function() {
            playing = true;
        };
        video.onpause = function() {
            playing = false;
        };
    });
};