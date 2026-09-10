//=============================================================================
// Phileas_TextWrap.js - Cho RPG Maker MV
//=============================================================================

/*:
 * @target MV
 * @plugindesc Tự động xuống dòng văn bản trong cửa sổ tin nhắn.
 * @author Phileas (phiên bản MV bởi [Tên bạn])
 *
 * @help
 * Plugin tự động chèn dấu ngắt dòng để văn bản không vượt quá khung cửa sổ.
 * Hoạt động tự động với cửa sổ tin nhắn.
 *
 * Đặc điểm:
 * - Giữ nguyên màu chữ (\C[x]) khi xuống dòng
 * - Hỗ trợ cửa sổ có hình avatar
 *
 * Không sử dụng Plugin Command vì MV không hỗ trợ.
 */

(function() {

    // Lấy thông tin màu chữ từ văn bản
    function getColor(word) {
        for (let i = word.length - 2; i > -1; --i) {
            if (word[i] == "\\" && word[i + 1] == "C" && word[i + 2] == "[") {
                let tag = "\\C[";
                let j = i + 3;
                while (word[j] != ']' && j < word.length) {
                    tag += word[j];
                    ++j;
                }
                if (j == word.length) return "";
                
                if (i > 0 && word[i - 1] == "\\") {
                    tag = "\\" + tag;
                }
                
                return tag + "]"
            }
        }
        return "";
    }
    
    // Tính chiều rộng văn bản (phiên bản MV)
    Window_Base.prototype.phileasGetTextWidth = function(text) {
        this.contents.fontSize = this.contents.fontSize;
        return this.textWidthEx(text);
    };

    // Hàm chính để xuống dòng tự động
    Window_Base.prototype.getWrappedText = function(text, maxWidth) {
        let wrapWindow = new Window_Base(0, 0, maxWidth, this.height);
        wrapWindow.contents.fontFace = this.contents.fontFace;
        wrapWindow.contents.fontSize = this.contents.fontSize;
        
        let result = "";
        let word = "";
        let line = "";
        let lastIndex = 0;
        let currentColor = "";
        let nFlag = false;
        
        if (text[text.length - 1] != " ") {
            text += " ";
        }
        
        for (let i = 0; i < text.length; ++i) {
            if (text[i] == "\\" && i + 1 < text.length && text[i+1] == "n") {
                nFlag = true;
            }
            else if (text[i] != " ") {
                continue;
            }
            
            word = text.substring(lastIndex, i + 1);
            let newColor = getColor(word);
            if (newColor != "") {
                currentColor = newColor;
            }
            
            line += word;
            let currentWidth = wrapWindow.phileasGetTextWidth(line);
            
            if (currentWidth > maxWidth) {
                result += "\n";
                currentWidth = wrapWindow.textWidthEx(word);
                line = word = currentColor + word;
            }
            
            result += word;
            lastIndex = i + 1;
            
            if (nFlag) {
                result += "\n";
                line = word = currentColor;
                lastIndex = i + 2;
                i++;
                nFlag = false;
            }
        }
        
        return result;
    };
    
    // Tính lề cho cửa sổ tin nhắn
    Window_Message.prototype.phileasGetWindowMessageMargin = function() {
        return $gameMessage.faceName() ? ImageManager.faceWidth + 30 : 4;
    }

    // Ghi đè hàm xử lý tin nhắn gốc
    var _Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        let text = $gameMessage.allText();
        let maxWidth = this.width - this.phileasGetWindowMessageMargin() * 2;
        let wrappedText = this.getWrappedText(text, maxWidth);
        $gameMessage._texts = [wrappedText];
        _Window_Message_startMessage.call(this);
    };
    
    // Hàm hỗ trợ cho MV (tương tự textWidthEx)
    Window_Base.prototype.textWidthEx = function(text) {
        return this.drawTextEx(text, 0, this.contents.height);
    };
}());