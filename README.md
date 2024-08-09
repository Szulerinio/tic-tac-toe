# OXO game in React with Xstate library for managing game states.

As it was my first time using Xstate, I was unsure how to handle game map to not cause state explosion. I've decided to keep currently playing player, map and stats of players in context.

Adding wins/draws to stats could be single action with parameter, but I didn't want to second guess myself all the time considering short time for this tasks, and it looked good enough

live app at [tic-tac-toe-five-pied.vercel.app](tic-tac-toe-five-pied.vercel.app)
