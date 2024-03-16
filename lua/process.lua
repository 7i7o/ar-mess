-- imports
local utils = require(".utils")

-- global variables
Users = Users or {}

Handlers.add(
    "register",
    Handlers.utils.hasMatchingTag("Action", "Register"),
    function(msg)
        -- Check for key tag
        if not msg.Tags.Key then
            print("No 'Key' Tag with Public Key to register" .. m.From)
            return
        end

        -- add public key and reply
        Users[msg.From] = msg.Tags.Key
        Handlers.utils.reply("registered")(msg)
    end
)

Handlers.add(
    "key",
    Handlers.utils.hasMatchingTag("Action", "Key"),
    function(msg)
        local user = msg.Tags.Target or msg.From
        Handlers.utils.reply(Users[user])(msg)
    end
)

Handlers.add(
    "unregister",
    Handlers.utils.hasMatchingTag("Action", "Unregister"),
    function(msg)
        if Users[msg.From] then
            Users[msg.From] = nil
        end
        Handlers.utils.reply("unregistered")(msg)
    end
)
