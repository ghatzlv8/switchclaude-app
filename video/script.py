"""SwitchClaude explainer — 5 scenes, brand palette, mock UI from primitives."""
from manim import *

BG = "#0A0A14"
NAVY = "#061B31"
PURPLE = "#533AFD"
GREEN = "#15BE53"
RED = "#E5484D"
WHITE = "#FFFFFF"
DIM = "#8A8FA3"
MONO = "Menlo"

config.pixel_width = 1280
config.pixel_height = 720


def mock_window(active_label="you@company.com", other_label="personal@gmail.com"):
    """Simplified SwitchClaude window mock."""
    frame = RoundedRectangle(corner_radius=0.15, width=5.2, height=3.2, color="#2A2E45", stroke_width=2)
    title = Text("Claude Switcher", font_size=22, font=MONO, color=WHITE).move_to(frame.get_top() + DOWN * 0.35)
    badge = RoundedRectangle(corner_radius=0.12, width=1.3, height=0.45, color=GREEN, fill_opacity=0.2, stroke_width=1)
    btxt = Text("Active", font_size=16, font=MONO, color=GREEN).move_to(badge.get_center())
    badge_group = VGroup(badge, btxt).next_to(title, RIGHT, buff=0.4)
    row1 = RoundedRectangle(corner_radius=0.12, width=4.4, height=0.7, color=NAVY, fill_opacity=1, stroke_width=1)
    r1t = Text("● " + active_label, font_size=18, font=MONO, color=WHITE).move_to(row1.get_center())
    row2 = RoundedRectangle(corner_radius=0.12, width=4.4, height=0.7, color="#2A2E45", fill_opacity=1, stroke_width=1)
    r2t = Text(other_label, font_size=18, font=MONO, color=WHITE).move_to(row2.get_center() + LEFT * 0.7)
    sw = RoundedRectangle(corner_radius=0.1, width=1.2, height=0.45, color=PURPLE, fill_opacity=1, stroke_width=0)
    swt = Text("Switch →", font_size=15, font=MONO, color=WHITE).move_to(sw.get_center())
    sw_group = VGroup(sw, swt).move_to(row2.get_center() + RIGHT * 1.4)
    rows = VGroup(VGroup(row1, r1t), VGroup(row2, r2t), sw_group).arrange(DOWN, buff=0.2).next_to(title, DOWN, buff=0.4)
    return VGroup(frame, title, badge_group, rows)


class S1_Pain(Scene):
    def construct(self):
        self.camera.background_color = BG
        t = Text("2 Claude accounts. 1 app.", font_size=40, font=MONO, color=WHITE, weight=BOLD)
        self.play(Write(t), run_time=1.2)
        self.wait(0.5)
        loop = VGroup(
            Text("log out …", font_size=30, font=MONO, color=RED),
            Text("log in …", font_size=30, font=MONO, color=RED),
            Text("lose your flow …", font_size=30, font=MONO, color=RED),
        ).arrange(DOWN, buff=0.25).next_to(t, DOWN, buff=0.6)
        self.play(FadeIn(loop, shift=DOWN * 0.3), run_time=1.2)
        self.wait(0.5)
        q = Text("Sound familiar?", font_size=30, font=MONO, color=DIM).next_to(loop, DOWN, buff=0.6)
        self.play(Write(q), run_time=1.0)
        self.wait(3.0)
        self.play(FadeOut(Group(*self.mobjects)), run_time=0.5)


class S2_Switch(Scene):
    def construct(self):
        self.camera.background_color = BG
        bar = Text("Claude ⇄", font_size=28, font=MONO, color=WHITE, weight=BOLD).to_edge(UP, buff=0.5)
        self.play(FadeIn(bar, shift=DOWN * 0.2), run_time=0.8)
        win = mock_window().scale(0.95)
        self.play(FadeIn(win, shift=UP * 0.3), run_time=1.0)
        self.wait(0.5)
        cursor = Dot(color=PURPLE, radius=0.12).move_to(win.get_center() + RIGHT * 1.4 + DOWN * 0.35)
        self.play(FadeIn(cursor), run_time=0.4)
        flash = SurroundingRectangle(win, color=GREEN, buff=0.08, stroke_width=4)
        self.play(Create(flash), run_time=0.6)
        self.play(FadeOut(flash), run_time=0.3)
        timer = Text("…2 seconds…", font_size=34, font=MONO, color=GREEN, weight=BOLD).next_to(win, DOWN, buff=0.5)
        self.play(Write(timer), run_time=1.0)
        self.wait(4.5)
        self.play(FadeOut(Group(*self.mobjects)), run_time=0.5)


class S3_Add(Scene):
    def construct(self):
        self.camera.background_color = BG
        steps = VGroup(
            Text("①  Hit  +  Add Account", font_size=30, font=MONO, color=WHITE),
            Text("②  Log in once", font_size=30, font=MONO, color=WHITE),
            Text("③  Saved forever — isolated profile", font_size=30, font=MONO, color=WHITE),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.4)
        for s in steps:
            self.play(FadeIn(s, shift=RIGHT * 0.3), run_time=0.8)
            self.wait(0.4)
        ok = Text("Chats can never mix — or get lost.", font_size=28, font=MONO, color=GREEN, weight=BOLD)
        ok.next_to(steps, DOWN, buff=0.6)
        self.play(Write(ok), run_time=1.2)
        self.wait(4.0)
        self.play(FadeOut(Group(*self.mobjects)), run_time=0.5)


class S4_License(Scene):
    def construct(self):
        self.camera.background_color = BG
        key = Text("CLAUDE-SWITCHER-XXXX-XXXX", font_size=26, font=MONO, color=WHITE)
        box = SurroundingRectangle(key, color=PURPLE, buff=0.25, stroke_width=3, corner_radius=0.15)
        self.play(FadeIn(key), Create(box), run_time=1.2)
        self.wait(0.5)
        price = Text("$9.99  once — no subscription", font_size=32, font=MONO, color=GREEN, weight=BOLD)
        price.next_to(box, DOWN, buff=0.5)
        self.play(Write(price), run_time=1.2)
        self.wait(0.5)
        plats = Text("Mac  •  Windows  •  Linux      offline ✓   5 devices ✓", font_size=24, font=MONO, color=DIM)
        plats.next_to(price, DOWN, buff=0.5)
        self.play(FadeIn(plats), run_time=1.0)
        self.wait(4.0)
        self.play(FadeOut(Group(*self.mobjects)), run_time=0.5)


class S5_Cta(Scene):
    def construct(self):
        self.camera.background_color = BG
        t1 = Text("Stop logging in and out.", font_size=36, font=MONO, color=DIM)
        self.play(Write(t1), run_time=1.0)
        self.wait(0.5)
        t2 = Text("SwitchClaude", font_size=56, font=MONO, color=WHITE, weight=BOLD)
        t2.next_to(t1, DOWN, buff=0.4)
        self.play(FadeIn(t2, shift=UP * 0.2), run_time=1.0)
        url = Text("switchclaude.com", font_size=36, font=MONO, color=PURPLE, weight=BOLD)
        url.next_to(t2, DOWN, buff=0.4)
        ubox = SurroundingRectangle(url, color=PURPLE, buff=0.2, stroke_width=2, corner_radius=0.15)
        self.play(Create(ubox), FadeIn(url), run_time=1.0)
        self.wait(2.5)
        self.play(FadeOut(Group(*self.mobjects)), run_time=0.5)
