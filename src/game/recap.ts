import { isRainlitMap } from './rainlit.ts';
import type { MapId, Progress } from './model.ts';
/** Only completed events appear. The live objective supplies the next step separately. */
export function journeyRecap(p: Progress, map: MapId): string {
  if (isRainlitMap(map)) {
    const r = p.rainlit;
    if (r.homecomingSeen) return 'Water reached the neighbors again. Cups filled, work resumed, and Luning saved us places at supper. The fresh seal is recorded. We can rest before asking who is closing the roads.';
    if (r.complete) return 'Mayumi let us rest beside the restored spring. A fresh seal formed while we watched. We will follow the mystery after visiting the neighbors whose water came back.';
    if (r.sealSeen) return 'After the repair, we heard a distant voice. Then a new pale ring formed on the closed hollow, in front of all of us.';
    if (r.restored) return 'Tala surveyed, Bagtas braced, and I untangled the basket. The spring reaches the hamlet again. Mayumi is waiting on the left bank.';
    if (r.basketFreed) return 'Luning’s basket is safe. The root still needs to be lowered onto its stone cradle.';
    if (r.rootBraced) return 'Bagtas set the forked support firmly beneath the root. The trapped basket can be freed safely.';
    if (r.channelRead) return 'Tala found a basket strap and reeds pinching the rill. We need to support the root before pulling.';
    if (r.metMayumi) return 'Mayumi, the Diwata ng Bukal, welcomed us onto the dry bank. She gave us an honest answer about home, and a careful plan for the spring.';
    if (r.metLuning) return 'Luning’s delivery is caught beneath a root upstream. We are going to ask Mayumi, keeper of the spring, how to help.';
    return 'Beyond Bagtas’s checked route, the rainlit road reaches a riverside community and its spring.';
  }
  if (map === 'bamboo' || map === 'turning') {
    const c = p.chapterTwo;
    if (c.debriefSeen) return 'We outwitted Bagtas’s three-labyrinth challenge. He kept his bargain: passage toward the spring, without another hidden turn. Trust will take more than winning.';
    if (c.routeVerified) return 'Stone, bending bamboo, running water. We checked all three landmarks and found the way back to Bagtas.';
    if (c.trailStep) return 'The paths shifted, but our checked landmarks stayed true. Tala kept our place in the route.';
    if (c.metBagtas) return 'Bagtas scattered hoofbeats through the bamboo. His challenge has three trails, one destination sign in each. Worn carvings and little trail clues show the real way. Our completed signs and the safe return path stay ours.';
    return 'We followed the open bamboo road beyond the repaired crossing. A tall traveler is waiting by a shelter.';
  }
  if (p.chapterComplete) return 'One bell returned, one crossing restored, and a friend beside me. Our Chapter 1 journey is safe in these pages.';
  if (p.rootRevealed) return 'We crossed the repaired bridge and found a pale mark on a cut root. We stopped to look more closely.';
  if (p.afterBellSeen) return 'We watched the village settle, shared a quiet moment, and talked about home. Tala is walking beside me.';
  if (p.bellRung) return 'We gave Bamboo Crossing its name back. The lamps steadied and the village began to breathe again.';
  if (p.bellHung) return 'Minda and I rehung the waybell. It is waiting at the clearing arch for its first proper ring.';
  if (p.bellReturned) return 'The water is running safely and Minda has her bell back. We agreed to meet at the arch.';
  if (p.waterRestored) return 'We freed the bell and restored the waterwheel. The low trail back to the clearing is dry again.';
  if (p.bellRecovered) return 'The bell is safe in my pocket. My spare kite string reached farther than I expected.';
  if (p.flowDiverted) return 'We sent the water into the western bypass. The wheel stopped and the crooked clanging fell quiet.';
  if (p.branchMoved) return 'We cleared the fallen branch from the bypass. There is room for the water to take another route.';
  if (p.visitedWaterworks || map === 'waterworks') return p.waterworksSeen ? 'We found the missing bell caught in the waterworks. We looked for a safe way to stop the wheel.' : 'We followed the maintenance trail down to Rootwater Works. The sound is much closer here.';
  if (p.metMang) return 'We met Mang Uban in the balete. He listened, and helped us understand where the strange ringing might begin.';
  if (p.visitedGrove || map === 'grove') return 'Tala and I reached the old grove. The enormous tree carries a sound we have yet to explain.';
  if (p.metTala) return 'I met Tala, a mapmaker with a careful pencil. She offered to help me look for a way back to Lola.';
  if (p.crossed || map !== 'yard') return 'I fell through the roots into Silong. There are lanterns here, and people I can ask for help.';
  if (p.talkedToLola) return 'Lola saved my merienda. I told her about the kite caught in the old tree.';
  return 'An afternoon in Lola\'s yard. A kite in the branches, and someone waiting to hear my latest adventure.';
}
